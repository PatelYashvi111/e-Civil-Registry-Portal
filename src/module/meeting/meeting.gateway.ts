import {WebSocketGateway,WebSocketServer,SubscribeMessage,ConnectedSocket,MessageBody,OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit,WsException} from '@nestjs/websockets';
import {Logger,UsePipes,ValidationPipe} from '@nestjs/common';
import { RoleEnum } from 'src/common/enums/role.enums';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MeetingService } from './meeting.service';
import { UserService } from '../user/user.service';
import { RoomDto } from './dto/roomdto';
import { OfferDto } from './dto/offer.dto';
import { AnswerDto } from './dto/answer.dto';
import { IceCandidateDto } from './dto/ice-candidate.dto';

  interface AuthSocket extends Socket {
    data: {
      userId?: string;
      user?: any;
      roomId?: string;
    };
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  @WebSocketGateway({
    namespace: '/meetings',
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  })
  export class MeetingGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
  {
    private readonly logger = new Logger(MeetingGateway.name);

    @WebSocketServer()
    server!: Server;

    constructor(
      private readonly meetingService: MeetingService,
      private readonly jwtService: JwtService,
      private readonly userService: UserService,
    ) {}

  afterInit() {
    this.logger.log('Meeting Gateway initialized');
  }


  async handleConnection(client: AuthSocket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      this.logger.warn(`Socket rejected - JWT token missing: ${client.id}`);

      client.disconnect(true);
      return;
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
        ignoreExpiration: false,
      });

      if (!decodedToken?.userId) {
        this.logger.warn(`Socket rejected - userId missing in JWT: ${client.id}`);

        client.disconnect(true);
        return;
      }

      const user = await this.userService.findById(decodedToken.userId);

      if (!user) {
        this.logger.warn(`Socket rejected - user not found: ${client.id}`);

        client.disconnect(true);
        return;
      }

      client.data.userId = user._id.toString();
      client.data.user = user;

      this.logger.log(`Meeting socket authenticated: ${client.id} - ${user._id}`);
    } catch (error) {
      
      this.logger.warn(`Invalid JWT for socket: ${client.id}`);

      client.disconnect(true);
    }
  }

  private async getRoomParticipants(roomId: string) {
    const sockets = await this.server
        .in(roomId)
        .fetchSockets();

    return sockets.map((socket) => ({
      socketId: socket.id,
      user: socket.data.user,
      userId: socket.data.userId,
    }));
  }


  private async getRoomState(roomId: string) {
    const participants = await this.getRoomParticipants(roomId);

    const userParticipant = participants.find(
      ({ user }) =>
        user?.role === RoleEnum.USER,
    );

    const clerkParticipant = participants.find(
      ({ user }) =>
        user?.role === RoleEnum.CLERK,
    );

    const isReady =
      participants.length === 2 &&
      !!userParticipant &&
      !!clerkParticipant;

    return {
      participants,
      userParticipant,
      clerkParticipant,
      isReady,
    };
  }

  private async validateRoomReadyForSignaling(
    roomId: string,
  ) {
    const participants = await this.getRoomParticipants(roomId);

    if (participants.length !== 2) {
      throw new WsException('Both participants have not joined the meeting.');
    }

    const hasUser = participants.some(
      ({ user }) =>
        user?.role === RoleEnum.USER,
    );

    const hasClerk = participants.some(
      ({ user }) =>
        user?.role === RoleEnum.CLERK,
    );

    if (!hasUser || !hasClerk) {
      throw new WsException('Meeting requires one user and one clerk.');
    }

    return participants;
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: AuthSocket,
  ) {
    const myUserId = client.data.userId;

    if (!myUserId) {
      throw new WsException('Unauthenticated socket connection.');
    }

    if (
      client.data.roomId &&
      client.data.roomId !== data.roomId
    ) {
      throw new WsException('Socket is already connected to another meeting.');
    }

    if (
      client.data.roomId === data.roomId
    ) {
      throw new WsException('You have already joined this meeting.');
    }

    const currentUser = client.data.user;

    if (!currentUser) {
      throw new WsException('User information not found.');
    }

    if (
      currentUser.role !== RoleEnum.USER &&
      currentUser.role !== RoleEnum.CLERK
    ) {
      throw new WsException('Only the user or assigned clerk can join the meeting room.');
    }

    const meeting = await this.meetingService.findByRoomId(data.roomId,currentUser);

    if (!meeting) {
      throw new WsException('Meeting not found.');
    }

    const participants = await this.getRoomParticipants(data.roomId);

    if (participants.length >= 2) {
      throw new WsException('Room is full.');
    }

    const duplicateParticipant =
      participants.some(
        ({ user }) =>
          user?._id?.toString() ===
          currentUser._id.toString(),
      );

    if (duplicateParticipant) {
      throw new WsException('You have already joined this meeting.');
    }

    const sameRoleParticipant =
      participants.some(
        ({ user }) =>
          user?.role === currentUser.role,
      );

    if (sameRoleParticipant) {
      throw new WsException('A participant with the same role is already in the meeting.');
    }

    await client.join(data.roomId);

    client.data.roomId = data.roomId;

    const myEmail = currentUser.email;
    const myRole = currentUser.role;

    this.logger.log(`${myRole} joined meeting: ${data.roomId}`);

    client.to(data.roomId).emit(
      'participant-joined',
      {
        roomId: data.roomId,
        userId: currentUser._id,
        email: myEmail,
        role: myRole,
      },
    );

    const roomState = await this.getRoomState(data.roomId);

  if (roomState.isReady) {
    await this.meetingService.startMeeting(data.roomId);

  this.server.to(data.roomId).emit(
    'meeting-ready',
    {
      roomId: data.roomId,

      participants:
        roomState.participants.map(
          ({ user }) => ({
            ...(user.role === RoleEnum.CLERK
              ? {
                  clerkId:
                    user._id.toString(),
                }
              : {
                  userId:
                    user._id.toString(),
                }),

            email: user.email,
            role: user.role,
          }),
        ),
    },
  );

  this.logger.log(`Meeting ready: ${data.roomId}`);
}

    return {
      message: 'Meeting joined successfully',
      data: {
        roomId: data.roomId,
      },
    };
  }

  @SubscribeMessage('offer')
  async offer(
    @MessageBody() data: OfferDto,
    @ConnectedSocket() client: AuthSocket,
  ) {
    const user = client.data.user;

    if (!user) {
      throw new WsException('User information not found on socket.');
    }

    const participants = await this.validateRoomReadyForSignaling(data.roomId);

    const currentParticipant =
      participants.find(
        ({ socketId }) =>
          socketId === client.id,
      );

    if (!currentParticipant) {
      throw new WsException('You are not a member of this meeting room.');
    }

    if (user.role !== RoleEnum.CLERK) {
      throw new WsException('Only the clerk can send the WebRTC offer.');
    }

    client.to(data.roomId).emit(
      'offer',
      {
        roomId: data.roomId,
        userId: user._id,
        email: user.email,
        role: user.role,
        offer: data.offer,
      },
    );
  }

  @SubscribeMessage('answer')
  async answer(
    @MessageBody() data: AnswerDto,
    @ConnectedSocket() client: AuthSocket,
  ) {
    const user = client.data.user;

    if (!user) {
      throw new WsException('User information not found on socket.');
    }

    const participants = await this.validateRoomReadyForSignaling(data.roomId);

    const currentParticipant =
      participants.find(
        ({ socketId }) =>
          socketId === client.id,
      );

    if (!currentParticipant) {
      throw new WsException('You are not a member of this meeting room.');
    }

    if (user.role !== RoleEnum.USER) {
      throw new WsException('Only the user can send the WebRTC answer.');
    }

    client.to(data.roomId).emit(
      'answer',
      {
        roomId: data.roomId,
        userId: user._id,
        email: user.email,
        role: user.role,
        answer: data.answer,
      },
    );
  }

  @SubscribeMessage('ice-candidate')
  async iceCandidate(
    @MessageBody() data: IceCandidateDto,
    @ConnectedSocket() client: AuthSocket,
  ) {
    const user = client.data.user;

    if (!user) {
      throw new WsException('User information not found on socket.');
    }

    const participants = await this.validateRoomReadyForSignaling(data.roomId);

    const currentParticipant =
      participants.find(
        ({ socketId }) =>
          socketId === client.id,
      );

    if (!currentParticipant) {
      throw new WsException('You are not a member of this meeting room.');
    }

    client.to(data.roomId).emit(
      'ice-candidate',
      {
        roomId: data.roomId,
        userId: user._id,
        email: user.email,
        role: user.role,
        candidate: data.candidate,
      },
    );
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: AuthSocket,
  ) {

    if (client.data.roomId !== data.roomId) {
      throw new WsException('Invalid meeting room.');
    }

    const participants = await this.getRoomParticipants(data.roomId);

    const currentParticipant =
      participants.find(
        ({ socketId }) =>
          socketId === client.id,
      );

    if (!currentParticipant) {
      throw new WsException('You are not a participant in this meeting room.');
    }

    const user = client.data.user;

    if (!user) {
      throw new WsException('User information not found on socket.');
    }

    client.to(data.roomId).emit(
      'participant-left',
      {
        roomId: data.roomId,
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    );

    await client.leave(data.roomId);
    client.data.roomId = undefined;

    this.logger.log(`Participant left meeting: ${data.roomId}`);
  }

  @SubscribeMessage('end-meeting')
  async endMeeting(
    @MessageBody() data: RoomDto,
    @ConnectedSocket() client: AuthSocket,
  ) {
    const user = client.data.user;

    if (!user) {
      throw new WsException('User information not found on socket.');
    }

    if (user.role !== RoleEnum.CLERK) {
      throw new WsException('Only the clerk can end the meeting.');
    }

    if (client.data.roomId !== data.roomId) {
      throw new WsException('Invalid meeting room.');
    }

    const participants = await this.getRoomParticipants(data.roomId);

    const currentParticipant = participants.find(
      ({ socketId }) => socketId === client.id,
    );

    if (!currentParticipant) {
      throw new WsException('You are not a participant in this meeting room.');
    }

    await this.emitMeetingEnded(data.roomId);

    return {message: 'Meeting ended successfully'};
  }
  async emitMeetingEnded(roomId: string) {
    
    await this.meetingService.endMeeting(roomId);

    this.server.to(roomId).emit(
      'meeting-ended',
      {
        roomId,
      },
    );

    const sockets = await this.server
        .in(roomId)
        .fetchSockets();

    for (const socket of sockets) {
      await socket.leave(roomId);

      socket.data.roomId = undefined;
    }

    this.logger.log(`Meeting ended: ${roomId}`);
  }

  async handleDisconnect(client: AuthSocket) {
    const roomId = client.data.roomId;

    if (!roomId) {
      this.logger.log(`Socket disconnected without meeting: ${client.id}`);

      return;
    }

    const user = client.data.user;

    if (!user) {
      return;
    }

    client.to(roomId).emit(
  'participant-left',
  {
    roomId,
    userId: user._id,
    email: user.email,
    role: user.role,
  },
);

    this.logger.log(`Socket disconnected from meeting: ${roomId}`);
  }
}
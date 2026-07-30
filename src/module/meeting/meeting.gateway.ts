import {WebSocketGateway,WebSocketServer,SubscribeMessage,ConnectedSocket,MessageBody,OnGatewayConnection,OnGatewayDisconnect} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MeetingService } from './meeting.service';
import { ApplicationService } from '../application/application.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MeetingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private rooms = new Map<
    string,
    {
      userSocket?: string;
      clerkSocket?: string;
      userId?: string;
      clerkId?: string;
      sockets: Set<string>;
    }
  >();

  constructor(
    private readonly meetingService: MeetingService,
    private readonly applicationService: ApplicationService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client Connected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @MessageBody() data: any, 
    @ConnectedSocket() client: Socket
  ) {

    const meeting = await this.meetingService.findByRoomId(data.roomId);

    if (!meeting) {
      client.emit('error', {message: 'Meeting not found'});
      return;
    }

    const application = await this.applicationService.findApplicationById(
      meeting.applicationId.toString(),
    );

    const isUser = application.userId.toString() === data.userId;
    const isClerk = application.clerkId.toString() === data.userId;

    if (!isUser && !isClerk) {
      client.emit('error', {message: 'Unauthorized user.'});
      return;
    }

    if (!this.rooms.has(data.roomId)) {
      this.rooms.set(data.roomId, {sockets: new Set()});
    }

    const room = this.rooms.get(data.roomId)!;

    if (room.sockets.size >= 2) {
      client.emit('error', {message: 'Room is full.'});
      return;
    }

    client.join(data.roomId);

    room.sockets.add(client.id);

    if (isUser) {
      room.userSocket = client.id;
      room.userId = data.userId;

      await this.meetingService.userJoined(data.roomId);
    }

    if (isClerk) {
      room.clerkSocket = client.id;
      room.clerkId = data.userId;

      await this.meetingService.clerkJoined(data.roomId)
    }

    client.to(data.roomId).emit('user-joined', {
      socketId: client.id,
      userId: data.userId,
    });

   if (room.userSocket && room.clerkSocket) {
     await this.meetingService.startMeeting(data.roomId);

    this.server.to(data.roomId).emit('room-ready', {
      message: 'Both participants joined.',
    });
  }

    client.emit('joined-room', {
      roomId: data.roomId,
      message: 'Successfully joined room.',
    });
  }

  @SubscribeMessage('offer')
  async offer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('offer', {
      offer: data.offer,
      socketId: client.id});
  }

  @SubscribeMessage('answer')
  async answer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('answer', {
      answer: data.answer,
      socketId: client.id,
    });
  }

  @SubscribeMessage('ice-candidate')
  async iceCandidate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('ice-candidate', {
      candidate: data.candidate,
      socketId: client.id,
    });
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.rooms.get(data.roomId);

    if (room) {
      room.sockets.delete(client.id);

      if (room.userSocket === client.id) {
        room.userSocket = undefined;
        room.userId = undefined;
      }

      if (room.clerkSocket === client.id) {
        room.clerkSocket = undefined;
        room.clerkId = undefined;
      }

      if (room.sockets.size === 0) {
        this.rooms.delete(data.roomId);
      }
    }

    client.leave(data.roomId);

    client.to(data.roomId).emit('user-left', {
      socketId: client.id,
    });

  }

  @SubscribeMessage('end-meeting')
  async endMeeting(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    await this.meetingService.endMeeting(data.roomId);

    this.server.to(data.roomId).emit('meeting-ended', {
      message: 'Meeting has ended.',
    });

    const sockets = await this.server.in(data.roomId).fetchSockets();

    sockets.forEach((socket) => {
      socket.leave(data.roomId);
    });

    this.rooms.delete(data.roomId);

  }

  handleDisconnect(client: Socket) {
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.sockets.has(client.id)) {
        room.sockets.delete(client.id);

        if (room.userSocket === client.id) {
          room.userSocket = undefined;
          room.userId = undefined;
        }

        if (room.clerkSocket === client.id) {
          room.clerkSocket = undefined;
          room.clerkId = undefined;
        }

        client.to(roomId).emit('user-left', {
          socketId: client.id,
        });

        if (room.sockets.size === 0) {
          this.rooms.delete(roomId);
        }

        break;
      }
    }

  }

}
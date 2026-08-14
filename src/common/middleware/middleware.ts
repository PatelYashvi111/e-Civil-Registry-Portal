// import {
//   BadRequestException,
//   Injectable,
//   NestMiddleware,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { Types } from 'mongoose';

// import { AadharService } from '../../module/aadhar/aadhar.service';
// import { OfficeService } from '../../module/office/office.service';
// import { OfficeDepartmentService } from '../../module/officeDepartment/officeDepartment.service';
// import { DepartmentService } from '../../module/department/department.service';
// import { StateService } from '../../module/state/state.service';
// import { DistrictService } from '../../module/district/district.service';
// import { SlotService } from '../../module/slot/slot.service';

// @Injectable()
// export class ReferenceIdMiddleware implements NestMiddleware {
//   constructor(
//     private readonly aadharService: AadharService,
//     private readonly officeService: OfficeService,
//     private readonly officeDepartmentService: OfficeDepartmentService,
//     private readonly departmentService: DepartmentService,
//     private readonly stateService: StateService,
//     private readonly districtService: DistrictService,
//     private readonly slotService: SlotService,
//   ) {}

//   async use(
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ) {
//     const body = req.body;

//     if (!body) {
//       return next();
//     }

//     // --------------------------------
//     // AADHAR IDs
//     // --------------------------------

//     const aadharFields = [
//       'fatherAadharId',
//       'motherAadharId',
//       'deceasedAadharId',
//     ];

//     for (const field of aadharFields) {
//       const value = body[field];

//       if (!value) continue;

//       if (Types.ObjectId.isValid(String(value))) {
//         continue;
//       }

//       const aadhar =
//         await this.aadharService.findByAadharNumber(
//           String(value),
//         );

//       if (!aadhar) {
//         throw new BadRequestException(
//           `${field} not found`,
//         );
//       }

//       body[field] = aadhar._id.toString();
//     }

//     // --------------------------------
//     // OFFICE
//     // --------------------------------

//     if (body.officeId) {
//       const value = String(body.officeId);

//       if (!Types.ObjectId.isValid(value)) {
//         const office =
//           await this.officeService.findByName(value);

//         if (!office) {
//           throw new BadRequestException(
//             'Office not found',
//           );
//         }

//         body.officeId = office._id.toString();
//       }
//     }

//     // --------------------------------
//     // DEPARTMENT
//     // --------------------------------

//     if (body.departmentId) {
//       const value = String(body.departmentId);

//       if (!Types.ObjectId.isValid(value)) {
//         const department =
//           await this.departmentService.findByName(value);

//         if (!department) {
//           throw new BadRequestException(
//             'Department not found',
//           );
//         }

//         body.departmentId =
//           department._id.toString();
//       }
//     }

//     // --------------------------------
//     // STATE
//     // --------------------------------

//     if (body.stateId) {
//       const value = String(body.stateId);

//       if (!Types.ObjectId.isValid(value)) {
//         const state =
//           await this.stateService.findByName(value);

//         if (!state) {
//           throw new BadRequestException(
//             'State not found',
//           );
//         }

//         body.stateId = state._id.toString();
//       }
//     }

//     // --------------------------------
//     // DISTRICT
//     // --------------------------------

//     if (body.districtId) {
//       const value = String(body.districtId);

//       if (!Types.ObjectId.isValid(value)) {
//         const district =
//           await this.districtService.findByName(value);

//         if (!district) {
//           throw new BadRequestException(
//             'District not found',
//           );
//         }

//         body.districtId =
//           district._id.toString();
//       }
//     }

//     // --------------------------------
//     // OFFICE DEPARTMENT
//     // --------------------------------

//     if (body.officeDepartmentId) {
//       const value = String(body.officeDepartmentId);

//       if (!Types.ObjectId.isValid(value)) {
//         const officeDepartment =
//           await this.officeDepartmentService.findByName(
//             value,
//           );

//         if (!officeDepartment) {
//           throw new BadRequestException(
//             'Office Department not found',
//           );
//         }

//         body.officeDepartmentId =
//           officeDepartment._id.toString();
//       }
//     }

//     // --------------------------------
//     // SLOT
//     // --------------------------------

//     // if (body.slotId) {
//     //   const value = String(body.slotId);

//     //   if (!Types.ObjectId.isValid(value)) {
//     //     const slot =
//     //       await this.slotService.findByTime(value);

//     //     if (!slot) {
//     //       throw new BadRequestException(
//     //         'Slot not found',
//     //       );
//     //     }

//     //     body.slotId = slot._id.toString();
//     //   }
//     // }

//     next();
//   }
// }
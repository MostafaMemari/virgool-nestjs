// import { UserEntity } from 'src/modules/user/entities/user.entity';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: UserEntity;
//     }
//   }
// }

import { UserEntity } from '../entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: UserEntity;
  }
}

import { Request } from 'express';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import { ValidationMessage } from '../enums/message.enum';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export type CallBakckDestination = (error: Error | null, destination: string) => void;
export type CallBakckFileName = (error: Error | null, filename: string) => void;
export type MulterFile = Express.Multer.File;

export function multerDestination(fieldName: string) {
  return function (req: Request, file: MulterFile, callback: CallBakckDestination): void {
    let path = join('public', 'uploads', fieldName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}

export function multerFileName(req: Request, file: MulterFile, callback: CallBakckFileName): void {
  const ext = extname(file.originalname).toLowerCase();
  if (!isValidImageFormat(ext)) {
    callback(new BadRequestException(ValidationMessage.InvalidImageFormat), '');
  } else {
    const filename = Date.now() + ext;
    callback(null, filename);
  }
}

function isValidImageFormat(ext: string) {
  return ['.png', 'jpg', '.jpeg'].includes(ext);
}

export function multerStorage(folderName: string) {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: multerFileName,
  });
}

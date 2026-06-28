import * as multer from 'multer';

declare global {
  namespace Express {
    export interface Request {
      file?: multer.Multer.File;
      files?: {
        [fieldname: string]: multer.Multer.File[];
      } | multer.Multer.File[];
    }
  }
}

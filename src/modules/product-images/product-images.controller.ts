// src/modules/product-images/product-images.controller.ts
import {
  Controller, Get, Post, Param, UseInterceptors, UploadedFile,
  Delete, Patch, ParseIntPipe, BadRequestException
} from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function ensureDirSync(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

@Controller('productos/:id/imagenes')
// 👉 aquí puedes aplicar tu AuthGuard que valida el JWT de Supabase
export class ProductImagesController {
  constructor(private readonly svc: ProductImagesService) {}

  @Get()
  async list(@Param('id', ParseIntPipe) id: number) {
    return this.svc.list(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (!ALLOWED_MIME.includes(file.mimetype)) {
        return cb(new BadRequestException('Tipo de archivo no permitido'), false);
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const productId = String(req.params.id);
        const dest = path.join(process.env.IMAGES_PATH!, 'productos', productId);
        ensureDirSync(dest);
        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const name = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
        cb(null, name);
      },
    }),
  }))
  async upload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Archivo requerido (campo "file")');
    return this.svc.createRecord(id, file.filename, file.mimetype, file.size);
  }

  @Patch(':imageId/principal')
  async setPrincipal(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.svc.setPrincipal(id, imageId);
  }

  @Delete(':imageId')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.svc.remove(id, imageId);
  }
}

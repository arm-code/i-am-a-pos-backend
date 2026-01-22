// src/modules/product-images/product-images.controller.ts
import {
  Controller, Get, Post, Param, UseInterceptors, UploadedFile,
  Delete, Patch, ParseIntPipe, BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
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

@ApiTags('Imágenes de Producto')
@Controller('productos/:id/imagenes')
// 👉 aquí puedes aplicar tu AuthGuard que valida el JWT de Supabase
export class ProductImagesController {
  constructor(private readonly svc: ProductImagesService) { }

  @Get()
  @ApiOperation({ summary: 'Listar todas las imágenes de un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de imágenes del producto' })
  async list(@Param('id', ParseIntPipe) id: number) {
    return this.svc.list(id);
  }

  @Post()
  @ApiOperation({ summary: 'Subir una imagen para un producto' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPEG, PNG, WebP, AVIF, máx 20MB)'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o tipo no permitido' })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
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
  @ApiOperation({ summary: 'Establecer imagen principal del producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiParam({ name: 'imageId', description: 'ID de la imagen', type: Number })
  @ApiResponse({ status: 200, description: 'Imagen principal actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto o imagen no encontrada' })
  async setPrincipal(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.svc.setPrincipal(id, imageId);
  }

  @Delete(':imageId')
  @ApiOperation({ summary: 'Eliminar una imagen del producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiParam({ name: 'imageId', description: 'ID de la imagen', type: Number })
  @ApiResponse({ status: 200, description: 'Imagen eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto o imagen no encontrada' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.svc.remove(id, imageId);
  }
}

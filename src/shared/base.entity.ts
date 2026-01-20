// src/shared/base.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Id único de registro',
  })
  id: number;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha de creación',
  })
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Fecha de última actualización',
  })
  updated_at: Date;
}
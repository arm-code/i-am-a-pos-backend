// src/shared/base.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Id único de registro',
  })
  id: string;

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
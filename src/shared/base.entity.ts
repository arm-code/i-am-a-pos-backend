import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Id unico de registro',
  })
  id: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha de creación',
  })
  created_at: Date;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Fecha de última actualización',
  })
  updated_at: Date;
}

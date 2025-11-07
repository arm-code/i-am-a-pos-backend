// src/finance/dto/update/update-rental.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateRentalDto } from '../create/create-rental.dto';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {}
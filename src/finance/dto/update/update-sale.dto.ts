// src/finance/dto/update/update-sale.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateSaleDto } from '../create/create-sale.dto';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}
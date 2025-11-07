// src/finance/dto/update/update-sale-item.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateSaleItemDto } from '../create/create-sale-item.dto';

export class UpdateSaleItemDto extends PartialType(CreateSaleItemDto) {}
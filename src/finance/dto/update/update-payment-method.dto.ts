import { PartialType } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from '../create/create-payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(
  CreatePaymentMethodDto,
) {}

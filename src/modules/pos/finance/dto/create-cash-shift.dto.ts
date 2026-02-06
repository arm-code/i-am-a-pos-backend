import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCashShiftDto {
    @ApiProperty({
        example: 1000.00,
        description: 'Monto inicial con el que se abre la caja',
    })
    @IsNumber()
    @Min(0)
    initialBalance: number;
}


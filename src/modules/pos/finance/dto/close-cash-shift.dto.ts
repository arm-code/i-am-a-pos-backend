import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloseCashShiftDto {
    @ApiProperty({
        example: 5450.50,
        description: 'Monto total real contado físicamente al cerrar la caja',
    })
    @IsNumber()
    @Min(0)
    realBalance: number;
}


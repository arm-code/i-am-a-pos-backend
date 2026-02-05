import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateCashShiftDto {
    @IsNumber()
    @Min(0)
    initialBalance: number;
}

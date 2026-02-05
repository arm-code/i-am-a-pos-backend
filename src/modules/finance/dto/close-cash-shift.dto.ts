import { IsNumber, Min } from 'class-validator';

export class CloseCashShiftDto {
    @IsNumber()
    @Min(0)
    realBalance: number;
}

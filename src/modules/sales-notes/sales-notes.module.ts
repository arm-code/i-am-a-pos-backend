import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesNotesService } from './sales-notes.service';
import { SalesNotesController } from './sales-notes.controller';
import { SaleNote } from './entities/sale-note.entity';
import { SaleNoteItem } from './entities/sale-note-item.entity';
import { FinanceModule } from '../../finance/finance.module';
import { SaleService } from '../../finance/services/sale.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SaleNote, SaleNoteItem]),
        FinanceModule,
    ],
    controllers: [SalesNotesController],
    providers: [SalesNotesService, SaleService],
})
export class SalesNotesModule { }

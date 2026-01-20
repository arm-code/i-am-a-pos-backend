import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SaleNote } from './entities/sale-note.entity';
import { SaleNoteItem } from './entities/sale-note-item.entity';
import { CreateSaleNoteDto } from './dto/create-sale-note.dto';
import { SaleService } from '../../finance/services/sale.service';
import { CreateCompleteSaleDto } from '../../finance/dto/create/create-complete-sale.dto';

@Injectable()
export class SalesNotesService {
    private readonly logger = new Logger(SalesNotesService.name);

    constructor(
        @InjectRepository(SaleNote)
        private readonly saleNoteRepository: Repository<SaleNote>,
        @InjectRepository(SaleNoteItem)
        private readonly saleNoteItemRepository: Repository<SaleNoteItem>,
        private readonly saleService: SaleService,
        private dataSource: DataSource,
    ) { }

    async create(createSaleNoteDto: CreateSaleNoteDto): Promise<SaleNote> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            this.logger.log(`Creando nota de venta ${createSaleNoteDto.note_number}`);

            // Verificar si el número de nota ya existe
            const existingNote = await this.saleNoteRepository.findOne({
                where: { note_number: createSaleNoteDto.note_number },
            });

            if (existingNote) {
                throw new ConflictException(`La nota de venta ${createSaleNoteDto.note_number} ya existe`);
            }

            // 1. Integrar con el módulo Finance primero para obtener la transacción
            const createCompleteSaleDto: CreateCompleteSaleDto = {
                total_amount: createSaleNoteDto.total,
                subtotal: createSaleNoteDto.subtotal,
                tax_amount: createSaleNoteDto.tax_amount || 0,
                description: `Nota de Venta ${createSaleNoteDto.note_number} - Cliente: ${createSaleNoteDto.client_name}`,
                business_type: 'retail', // Tipo por defecto
                sale_date: createSaleNoteDto.date ? new Date(createSaleNoteDto.date) : new Date(),
                sale_items: createSaleNoteDto.items
                    .filter(item => item.product_id !== undefined && item.product_id !== null && item.product_id > 0)
                    .map(item => ({
                        product_id: item.product_id as number,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        total_price: item.amount,
                    })),
            };

            // Nota: SaleService.createCompleteSale maneja su propia transacción y queryRunner.
            // Pero aquí necesitamos que sea atómico con la nota de venta.
            // Sin embargo, SaleService no acepta un EntityManager externo en su método actual.
            // Verificaremos si podemos llamar al servicio o replicar la lógica si es necesario.
            // Por brevedad y consistencia con el requerimiento, usaremos el servicio.
            const savedSale = await this.saleService.createCompleteSale(createCompleteSaleDto);

            // 2. Crear la Nota de Venta vinculada a la transacción de la venta
            const saleNote = this.saleNoteRepository.create({
                ...createSaleNoteDto,
                transaction_id: savedSale.transaction_id,
                items: createSaleNoteDto.items.map(item =>
                    this.saleNoteItemRepository.create({
                        ...item,
                        product_id: (item.product_id && item.product_id > 0) ? item.product_id : null,
                    })
                ),
            });

            const savedNote = await queryRunner.manager.save(saleNote);

            await queryRunner.commitTransaction();
            this.logger.log(`Nota de venta ${savedNote.note_number} creada exitosamente`);

            return savedNote;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error al crear nota de venta:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<SaleNote[]> {
        return await this.saleNoteRepository.find({
            relations: ['items', 'transaction'],
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<SaleNote> {
        const note = await this.saleNoteRepository.findOne({
            where: { id },
            relations: ['items', 'transaction'],
        });

        if (!note) {
            throw new NotFoundException(`Nota de venta con ID ${id} no encontrada`);
        }

        return note;
    }
}

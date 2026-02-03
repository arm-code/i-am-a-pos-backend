import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new customer' })
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all customers' })
    findAll() {
        return this.customersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a customer by ID' })
    findOne(@Param('id') id: string) {
        return this.customersService.findOne(id);
    }

    @Post(':id/payment')
    @ApiOperation({ summary: 'Register a payment (abono) to customer balance' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                amount: { type: 'number', example: 50.5, description: 'Monto del abono' },
            },
            required: ['amount'],
        },
    })
    registerPayment(@Param('id') id: string, @Body('amount') amount: number) {
        return this.customersService.registerPayment(id, amount);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a customer' })
    remove(@Param('id') id: string) {
        return this.customersService.remove(id);
    }
}

import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) { }

    @Post()
    @ApiOperation({ summary: 'Run Database Seed (Be careful: truncates all tables!)' })
    runSeed() {
        return this.seedService.runSeed();
    }
}

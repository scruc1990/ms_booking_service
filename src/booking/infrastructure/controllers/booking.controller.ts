import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBookingService } from '../../application/services/create-booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { IdempotencyInterceptor } from '../../../common/interceptors/idempotency.interceptor';

@Controller('bookings')
export class BookingController {
  constructor(private readonly createBookingService: CreateBookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(IdempotencyInterceptor)
  async create(
    @Body() dto: CreateBookingDto,
    @GetUser('id') userId: string,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ) {
    return this.createBookingService.execute(dto, userId, idempotencyKey);
  }
}

import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { FirestoreService } from 'src/models/models.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, FirestoreService],
})
export class PaymentsModule {}

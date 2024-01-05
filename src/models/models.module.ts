import { Module } from '@nestjs/common';
import { FirestoreService } from './models.service';
import { FirestoreController } from './models.controller';

@Module({
  controllers: [FirestoreController],
  providers: [FirestoreService],
})
export class ModelsModule {}

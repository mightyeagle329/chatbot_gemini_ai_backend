import { Controller } from '@nestjs/common';
import { MistralService } from './mistral.service';

@Controller('mistral')
export class MistralController {
  constructor(private readonly mistralService: MistralService) {}
}

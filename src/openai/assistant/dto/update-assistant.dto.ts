import { PartialType } from '@nestjs/mapped-types';
import { CreateAssistantDto } from './create-assistant.dto';

export class UpdateAssistantDto extends PartialType(CreateAssistantDto) {}

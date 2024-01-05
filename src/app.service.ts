import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>SgelaAI</h1><p>The AI app for Students and Teachers</p>';
  }
}

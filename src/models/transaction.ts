export class AITransaction {
  id: string;
  date: string;
  tokens: number;
  examlinkId: number;
  prompt: string;
  userId: number;
  organizationId: number;

  constructor(
    id: string,
    date: string,
    tokens: number,
    examlinkId: number,
    prompt: string,
    userId: number,
    organizationId: number
  ) {
    this.id = id;
    this.date = date;
    this.tokens = tokens;
    this.examlinkId = examlinkId;
    this.prompt = prompt;
    this.userId = userId;
    this.organizationId = organizationId;
  }
  toJson(): Record<string, any> {
    return {
      id: this.id,
      date: this.date,
      tokens: this.tokens,
      examlinkId: this.examlinkId,
      prompt: this.prompt,
      userId: this.userId,
      organizationId: this.organizationId,
    };
  }
}

class ChatConfig {
  contents: Content[];
  safetySettings: SafetySetting[];
  generationConfig: GenerationConfig;
}
class GenerationConfig {
  stopSequences: string[];
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  topK: number;
}
class SafetySetting {
  category: string;
  threshold: string;
}
class Content {
  parts: Part[];
}
class Part {
  text: string;
}

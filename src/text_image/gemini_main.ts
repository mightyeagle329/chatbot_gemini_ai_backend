import { VertexAI, HarmCategory, HarmBlockThreshold, GenerateContentRequest } from "@google-cloud/vertexai";

const project = "sgela-ai-33";
const location = "us-east4";

const vertex_ai = new VertexAI({ project: project, location: location });

// Instantiate models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: "gemini-pro",
  // The following parameters are optional
  // They can also be passed to individual content generation requests
  safety_settings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  generation_config: { max_output_tokens: 256 },
});

const generativeVisionModel = vertex_ai.preview.getGenerativeModel({
  model: "gemini-pro-vision",
});

class GeminiMain {
  async sendImagePrompt(): Promise<any> {
    
    //generativeVisionModel.generateContent()
    return "";
  }
}
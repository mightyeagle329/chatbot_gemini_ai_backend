// import { Injectable } from "@nestjs/common";
// import OpenAI from "openai";
// const openai = new OpenAI();

// @Injectable()
// export class OpenApiService {
//   async chat(messages: any[]): Promise<string> {
//     const completion = await openai.chat.completions.create({
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: "Who won the world series in 2020?" },
//         {
//           role: "assistant",
//           content: "The Los Angeles Dodgers won the World Series in 2020.",
//         },
//         { role: "user", content: "Where was it played?" },
//       ],
//       model: "gpt-3.5-turbo",
//     });

//     console.log(
//       `completion.choices[0] finishReason: ${completion.choices[0].finish_reason}`
//     );
//     console.log(
//       `completion.choices[0] message: ${completion.choices[0].message}`
//     );
//     console.log(`completion: ${JSON.stringify(completion)}`);

//     return completion.choices[0].message.content;
//   }
// }

// export class OpenAIMessage {
//   role: string;
//   content: string;
// }

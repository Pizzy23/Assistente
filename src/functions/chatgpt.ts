import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.CHAT_GPT });

interface InputGpt {
  personality: string;
  message: string;
}

export class GPT {
  async gptResume(input: InputGpt): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: input.personality },
          { role: "user", content: input.message },
        ],
        model: "gpt-3.5-turbo-16k",
      });

      const res = completion.choices[0].message.content;
      return res.trim();
    } catch (error: any) {
      throw new Error(`Error sending chat request: ${error.message}`);
    }
  }
}

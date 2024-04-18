import axios from "axios";
import "dotenv/config";

const key = process.env.CHAT_GPT;

interface InputGpt {
  personality: string;
  message: string;
}

export class GPT {
  async gptResume(input: InputGpt): Promise<string[]> {
    try {
      const response = await axios.post<{
        choices: { message: { content: string } }[];
      }>(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "text-davinci-004",
          messages: [
            {
              role: "system",
              content: input.personality,
            },
            {
              role: "user",
              content: input.message,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
        }
      );

      const res = response.data.choices[0].message.content;
      const cleanedText = res.trim().replace(/^"|"$/g, "");
      const clearNumber = cleanedText.replace(/\d+\./g, "");
      const lines = clearNumber.split("\n");

      return lines;
    } catch (error) {
      throw new Error(`Error sending chat request: ${error}`);
    }
  }
}

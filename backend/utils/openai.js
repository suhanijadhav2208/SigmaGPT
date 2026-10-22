import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getOpenAIAPIResponse = async (message) => {
    try {
        const response = await client.responses.create({
            model: "gpt-6-luna",
            input: message,
        });

        return response.output_text;

    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        throw error;
    }
};

export default getOpenAIAPIResponse;
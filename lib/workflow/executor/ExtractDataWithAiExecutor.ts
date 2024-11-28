import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
import { FillInputTask } from "../task/FillInput";
import { ClickElementTask } from "../task/ClickElementTask";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAiTask";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai"

export async function ExtractDataWithAiExecutor(
    environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
): Promise<boolean> {
    try {
        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("input->credentials not defined");
            return false;
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("input->prompt not defined");
            return false;
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("input->content not defined");
            return false;
        }

        // Get credential from DB
        const credential = await prisma.credential.findUnique({
            where: {
                id: credentials,
            },
        });

        if (!credential) {
            environment.log.error("credential not found");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("credential value is not decrypted");
            return false;
        }

        // const mockExtractedData = {
        //     "usernameSelector": "#username",
        //     "passwordSelector": "#password",
        //     "loginButtonSelector": "body > div > form > input.btn.btn-primary"
        // }

        const openAi = new OpenAI({
            apiKey: plainCredentialValue
        });

        const response = await openAi.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure that the output is always a valid JSON array without any surrounding text."
                },
                {
                    role: "user",
                    content: content
                }, 
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 1,

        });

        environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
        environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);

        const result = response.choices[0].message.content;
        if (!result) {
            environment.log.error("empty response from OpenAI");
            return false;
        }

        environment.setOutput("Extracted data", result);
        
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
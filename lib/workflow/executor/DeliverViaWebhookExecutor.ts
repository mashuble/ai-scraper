import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
import { FillInputTask } from "../task/FillInput";
import { ClickElementTask } from "../task/ClickElementTask";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhookTask";

export async function DeliverViaWebhookExecutor(
    environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
    try {
        const targetUrl = environment.getInput("Target URL");
        if (!targetUrl) {
            environment.log.error("input->targetUrl not defined");
            return false;
        }
        
        const body = environment.getInput("Body");
        if (!body) {
            environment.log.error("input->body not defined");
            return false;
        }

        console.log('targetUrl', targetUrl);

        const response = await fetch(targetUrl, {
            method: "GET",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const statusCode = response.status;

        if(statusCode !== 200) {
            environment.log.error(`Status code: ${statusCode}`);
            return false;
        }

        const responseBody = await response.json();
        environment.log.info(`Response body: ${JSON.stringify(responseBody, null, 2)}`);
        
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
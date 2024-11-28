import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
import { FillInputTask } from "../task/FillInput";
import { ClickElementTask } from "../task/ClickElementTask";
import { NavigateUrlTask } from "../task/NavigateUrlTask";

export async function NavigateUrlExecutor(
    environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
    try {
        const url = environment.getInput("URL");
        if (!url) {
            environment.log.error("input->url not defined");
            return false;
        }

        await environment.getPage()!.goto(url);

        environment.log.info(`Navigated to ${url}`);
        
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
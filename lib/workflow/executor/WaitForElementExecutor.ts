import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
import { FillInputTask } from "../task/FillInput";
import { ClickElementTask } from "../task/ClickElementTask";
import { WaitForElementTask } from "../task/WaitForElementTask";

export async function WaitForElementExecutor(
    environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("input->selector not defined");
            return false;
        }

        const visibility = environment.getInput("Visibility");
        if (!visibility) {
            environment.log.error("input->visibility not defined");
            return false;
        }

        await environment.getPage()!
            .waitForSelector(selector, { 
                visible: visibility === "visible", 
                hidden: visibility === "hidden" 
            });

        environment.log.info(`Element ${selector} became ${visibility}`);
        
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
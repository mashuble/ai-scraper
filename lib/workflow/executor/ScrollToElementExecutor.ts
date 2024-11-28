import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../task/PageToHtml";
import { FillInputTask } from "../task/FillInput";
import { ClickElementTask } from "../task/ClickElementTask";
import { ScrollToElementTask } from "../task/ScrollToElementTask";

export async function ScrollToElementExecutor(
    environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        if (!selector) {
            environment.log.error("input->selector not defined");
            return false;
        }

        await environment.getPage()!.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error(`Element with selector ${selector} not found`);
            }

            const top = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top });
        }, selector);
        
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
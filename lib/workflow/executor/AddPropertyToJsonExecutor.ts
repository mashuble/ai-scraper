import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJsonTask } from "../task/AddPropertyToJsonTask";

export async function AddPropertyToJsonExecutor(
    environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
): Promise<boolean> {
    try {
        const jsonData = environment.getInput("JSON");
        if (!jsonData) {
            environment.log.error("input->json not defined");
            return false;
        }
        
        const propertyName = environment.getInput("Property name");
        if (!propertyName) {
            environment.log.error("input->propertyName not defined");
            return false;
        }

        const propertyValue = environment.getInput("Property value");
        if (!propertyValue) {
            environment.log.error("input->propertyValue not defined");
            return false;
        }

        const json = JSON.parse(jsonData);
        json[propertyName] = propertyValue;

        environment.setOutput("Updated JSON", propertyValue);
        
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
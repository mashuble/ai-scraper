import { SetupUser } from "@/actions/billing/SetupUser";

async function SetupPage() {
  return await SetupUser();
}

export default SetupPage
import { google } from "googleapis";
import { GOOGLE_SHEETS_READONLY_SCOPE } from "@/constants/googleApi";

let auth: InstanceType<typeof google.auth.GoogleAuth> | undefined;

export function getAuth() {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: [GOOGLE_SHEETS_READONLY_SCOPE],
    });
  }
  return auth;
}

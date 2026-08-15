import { google } from "googleapis";

let auth: InstanceType<typeof google.auth.GoogleAuth> | undefined;

export function getAuth() {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
  }
  return auth;
}

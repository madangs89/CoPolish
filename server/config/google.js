import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";

dotenv.config();
export const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

import express from "express";
import { google } from "googleapis";
import { config } from "dotenv";
import { client, storeOrUpdateUser } from "./db/db";
import { verifyToken } from "./utils/token";
import { createUserTable } from "./db/queries";

config();
const app = express();

export const oauth2client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.get("/auth/google", (_req, res) => {
  try {
    const authUrl = oauth2client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
    });
    res.redirect(authUrl);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Authentication failed" });
  }
});

app.get("/auth/callback", async (req, res): Promise<any> => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2client.getToken(code as string);
    oauth2client.setCredentials(tokens);

    const payload = await verifyToken(tokens.id_token as string);
    const user = await storeOrUpdateUser(payload);

    if (!user)
      return res.status(401).json({ message: "Couldn't store user in db" });

    res.json({ message: "User authenticated successfully", data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Authentication failed" });
  }
});

(async function connectDB() {
  try {
    await client.connect();
    await client.query(createUserTable);
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
    console.log("Connected to database");
  } catch (error: any) {
    console.error("Error connecting to DB: ", error.message);
  }
})();

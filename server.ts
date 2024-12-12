import express from "express";
import { google } from "googleapis";
import { config } from "dotenv";

config();
const app = express();

const oauth2client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.get("/auth/google", (req, res) => {
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

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2client.getToken(code as string);
    oauth2client.setCredentials(tokens);
    res.json({ tokens });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Authentication failed" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

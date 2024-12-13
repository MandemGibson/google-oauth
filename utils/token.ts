import { oauth2client } from "../server";

export const verifyToken = async (token: string) => {
  try {
    const ticket = await oauth2client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error: any) {
    console.error("Error verifying token: ", error.message);
  }
};

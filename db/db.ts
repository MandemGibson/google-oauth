import { Client } from "pg";
import { config } from "dotenv";
import { addUser, getUserById, updateUser } from "./queries";
config();

export const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const storeOrUpdateUser = async (payload: any) => {
  const { sub: id, name, email, picture } = payload;
  try {
    const existingUser = await client.query(getUserById, [id]);
    if (existingUser.rows.length > 0) {
      const updatedUser = await client.query(updateUser, [
        id,
        name,
        email,
        picture,
      ]);
      return updatedUser.rows[0];
    }

    const newUser = await client.query(addUser, [id, name, email, picture]);
    return newUser.rows[0];
  } catch (error: any) {
    console.error("Error storing user: ", error.message);
  }
};

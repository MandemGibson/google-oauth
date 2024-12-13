# Google OAuth Integration

This project demonstrates how to integrate Google OAuth into a Node.js application using the `googleapis` package. It allows users to authenticate via their Google accounts.

## Prerequisites
- Node.js installed
- `.env` file with Google OAuth credentials
- PostgreSQL database setup

## Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Create a `.env` file with the following variables:
     ```env
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     REDIRECT_URI=http://localhost:3000/auth/callback
     DB_USER=your-database-user
     DB_HOST=your-database-host
     DB_NAME=your-database-name
     DB_PASSWORD=your-database-password
     DB_PORT=your-database-port
     ```

3. **Database Setup**:
   - Ensure your PostgreSQL database is set up with the following schema:
     ```sql
     CREATE TABLE IF NOT EXISTS users (
       id VARCHAR(25),
       name VARCHAR(255),
       email VARCHAR(255),
       picture VARCHAR(255)
     );
     ```

## Usage
1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Authenticate with Google**:
   - Navigate to `http://localhost:3000/auth/google` to initiate the Google OAuth flow.
   - After authentication, Google redirects to `http://localhost:3000/auth/callback` with a `code` query parameter.

3. **Handling OAuth Callback**:
   - The server exchanges the `code` for tokens and sets the credentials.
   - Verify the ID token and store or update the user in the database:
     ```javascript
     app.get('/auth/callback', async (req, res) => {
       const { code } = req.query;

       try {
         const { tokens } = await oauth2client.getToken(code);
         oauth2client.setCredentials(tokens);

         const payload = await verifyToken(tokens.id_token); // Decode the JWT
         const user = await storeOrUpdateUser(payload); // Store or update the user in the database

         const token = generateToken(user); // Generate JWT for session management

         res.json({ message: 'User authenticated successfully', user, token });
       } catch (error) {
         res.status(500).json({ message: error.message || 'Authentication failed' });
       }
     });
     ```

4. **Store or Update User**:
   - `storeOrUpdateUser` handles storing new users or updating existing users in the database:
     ```javascript
     import { getUserById, addUser, updateUser } from './db/db';

     export const storeOrUpdateUser = async (userInfo) => {
       try {
         let user = await client.query(getUserById, [userInfo.sub]);

         if (user.rows.length === 0) {
           user = await client.query(addUser, [userInfo.sub, userInfo.name, userInfo.email, userInfo.picture]);
         } else {
           user = await client.query(updateUser, [userInfo.sub, userInfo.name, userInfo.email, userInfo.picture]);
         }

         return user.rows[0];
       } catch (error) {
         throw new Error('Error storing user: ' + error.message);
       }
     };
     ```

## Troubleshooting
- **Error storing user**:
  - Ensure the database table schema is correct.
  - Validate the query parameters used in `getUserById`, `addUser`, and `updateUser`.

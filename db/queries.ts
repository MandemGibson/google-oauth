//Get user by ID
export const getUserById =
  "SELECT id, name, email, picture FROM users WHERE id = $1";

//Add user if not exist
export const addUser =
  "INSERT INTO users (id, name, email, picture) VALUES ($1, $2, $3, $4) RETURNING *";

//Update a user
export const updateUser =
  "UPDATE users SET name = $2, email = $3, picture = $4 WHERE id = $1 RETURNING *";

//Delete user
export const deleteUser = "DELETE * FROM user WHERE id = $1 RETURNING *";

//Create user table if not exists
export const createUserTable =
  "CREATE TABLE IF NOT EXISTS users (id VARCHAR(25), name VARCHAR(255), email VARCHAR(255), picture VARCHAR(255))";

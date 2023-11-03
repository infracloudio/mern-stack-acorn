import { MongoClient } from "mongodb";

// const dbHost = process.env.DB_HOST || "";
// const dbPort = process.env.DB_PORT || "";

// const connectionString = dbHost + ":" + dbPort;

const dbHost = process.env.DB_HOST || "";
const dbPort = process.env.DB_PORT || "";
const dbUser = process.env.DB_USER || "";
const dbPass = process.env.DB_PASS || "";
const dbName = process.env.DB_NAME || "";

const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
//const connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;

const client = new MongoClient(connectionString);

let conn;
try {
  console.log("Connecting to MongoDB ...");
  conn = await client.connect();
  if (conn) {
    console.log("Connected to MongoDB");
  } else {
    console.log("Failed to connect to MongoDB");
  }
} catch(e) {
  console.log("Error connecting to MongoDB ");
  console.error(e);
}

let db = conn.db(dbName);

export default db;
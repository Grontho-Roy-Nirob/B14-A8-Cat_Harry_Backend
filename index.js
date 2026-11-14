import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import "dotenv/config";
const app = express();
const PORT = 8000;

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
    throw err;
  }
}
app.use(cors());
app.use(express.json());

// Database Connection
const mongoClient = await connectToMongoDB();
 
const db = mongoClient.db("studiospace");
const usersCollection = db.collection("users");
const studioCollection = db.collection("studios");
const bookingCollection = db.collection("bookings");


app.get("/", (req, res) => {
  res.send({ message: "Server is running fine!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

export default app
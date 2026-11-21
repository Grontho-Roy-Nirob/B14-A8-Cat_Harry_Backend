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
  }
}

app.use(cors());
app.use(express.json());

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("studiospace");
const studioCollection = db.collection("studios");
const bookingCollection = db.collection("bookings");

// Add a new studio to the database.
app.post("/add-studio", async (req, res) => {
  const data = req.body;
  const result = await studioCollection.insertOne(data);
  res.send(result);
});

// Get all studios from the database.
app.get("/studios", async (req, res) => {
  const result = await studioCollection.find().toArray();
  res.send(result);
});

// Get the first 5 studios from the database as featured studios.
app.get("/featured-studios", async (req, res) => {
  const result = await studioCollection.find().limit(5).toArray();
  res.send(result);
});

app.get("/my-listings/:email", async (req, res) => {
  const { email } = req.params;
  const result = await studioCollection.find({ ownerEmail: email }).toArray();
  res.send(result);
});

app.get("/studio/:id", async (req, res) => {
  const { id } = req.params;
  const result = await studioCollection.findOne({
    _id: new ObjectId(id),
  });
  res.send(result);
});

app.patch("/studio/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await studioCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
  res.json(result);
});

app.delete("/studio/:id", async (req, res) => {
  const { id } = req.params;
  const result = await studioCollection.deleteOne({
    _id: new ObjectId(id),
  });
  res.json(result);
});

app.post("/booking", async (req, res) => {
  const data = req.body;
  data.status = "Pending";
  const result = await bookingCollection.insertOne(data);
  res.send(result);
});

app.get("/my-bookings/:email", async (req, res) => {
  const { email } = req.params;
  const result = await bookingCollection.find({ email: email }).toArray();
  res.send(result);
});

// Cancel a pending slot by PATCHing its status to "Cancelled".
app.patch("/my-bookings/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await bookingCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
  res.json(result);
});

app.delete("/my-bookings/:id", async (req, res) => {
  const { id } = req.params;
  const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

app.get("/", (req, res) => {
  res.send({ message: "Server is running fine!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

export default app;

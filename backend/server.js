const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;

app.get("/todos", async (req, res) => {
  const todos = await db.collection("todos").find().toArray();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { text } = req.body;
  const result = await db.collection("todos").insertOne({ text, done: false });
  res.json(result);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  const result = await db
    .collection("todos")
    .updateOne({ _id: new ObjectId(id) }, { $set: { done } });
  res.json(result);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.collection("todos").deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

async function start() {
  await client.connect();
  db = client.db("mern-todo");
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
}

start();

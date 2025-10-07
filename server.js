const express = require("express");
const cors = require("cors");
const app = express();

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const URL = "mongodb://localhost:27017";
const DB_NAME = "fsd31";

// Midleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

let users = [
  {
    id: 1,
    name: "Raj",
    email: "raj@gmail.com",
  },
  {
    id: 2,
    name: "Priya",
    email: "priya@gmail.com",
  },
];

app.get("/user", async (req, res) => {
  // Step 1 : Connect the database
  const connection = await mongoClient.connect(URL);

  // Step 2 : Select the DB
  const db = connection.db(DB_NAME);

  // Step 3 : Select the Collection
  const collection = db.collection("users");

  // Step 4 : Do the operation
  const users = await collection.find({}).toArray();

  // Mongodb db will return the cursor data of the document. It will not return
  // original data. To convert Cursor to JSON we use .toArray();

  // Step 5 : Close the connection
  await connection.close();

  res.json(users);
});

app.post("/user", async (req, res) => {
  try {
    // Step 1 : Connect the database
    const connection = await mongoClient.connect(URL);

    // Step 2 : Select the DB
    const db = connection.db(DB_NAME);

    // Step 3 : Select the Collection
    const collection = db.collection("users");

    // Step 4 : Do the operation
    const user = await collection.insertOne(req.body);

    // Step 5 : Close the connection
    await connection.close();

    res.json({
      _id: user.insertedId,
    });
  } catch (error) {
    console.log(error);
  }

  // req.body.id = users.length + 1;
  // users.push(req.body);
  // res.json({
  //   message: "User created",
  // });
});

app.get("/user/:id", async (req, res) => {
  try {
    // Step 1 : Connect the database
    const connection = await mongoClient.connect(URL);

    // Step 2 : Select the DB
    const db = connection.db(DB_NAME);

    // Step 3 : Select the Collection
    const collection = db.collection("users");

    // Step 4 : Do the operation
    const user = await collection.findOne({ _id: new ObjectId(req.params.id) });

    // Step 5 : Close the connection
    await connection.close();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    // Step 1 : Connect the database
    const connection = await mongoClient.connect(URL);

    // Step 2 : Select the DB
    const db = connection.db(DB_NAME);

    // Step 3 : Select the Collection
    const collection = db.collection("users");

    // Step 4 : Do the operation
    const updateduser = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    // Step 5 : Close the connection
    await connection.close();

    res.json(updateduser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    // Step 1 : Connect the database
    const connection = await mongoClient.connect(URL);

    // Step 2 : Select the DB
    const db = connection.db(DB_NAME);

    // Step 3 : Select the Collection
    const collection = db.collection("users");

    // Step 4 : Do the operation
    const user = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    // Step 5 : Close the connection
    await connection.close();

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

app.listen(8000);

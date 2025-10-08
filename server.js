const express = require("express");
const cors = require("cors");
const app = express();
const dotEnv = require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const { User } = require("./models/user");
mongoose.connect(process.env.DB);
// const mongodb = require("mongodb");
// const mongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectId;

// const URL = process.env.DB;
// const DB_NAME = "fsd31";

// Midleware
app.use(
  cors({
    origin: "https://gilded-tapioca-41b421.netlify.app",
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

function authenticate(req, res, next) {
  console.log(req.headers);
  if (!req.headers.authorization) {
    res.status(401).json({
      message: "Not Authorized",
    });
  }

  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    if (decode) {
      next();
    } else {
      res.status(401).json({
        message: "Not Authorized",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Not Authorized",
    });
  }
}

app.get("/user", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
  // // Step 1 : Connect the database
  // const connection = await mongoClient.connect(URL);

  // // Step 2 : Select the DB
  // const db = connection.db(DB_NAME);

  // // Step 3 : Select the Collection
  // const collection = db.collection("users");

  // // Step 4 : Do the operation
  // const users = await collection.find({}).toArray();

  // // Mongodb db will return the cursor data of the document. It will not return
  // // original data. To convert Cursor to JSON we use .toArray();

  // // Step 5 : Close the connection
  // await connection.close();

  // res.json(users);
});

app.post("/user", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
    });

    await user.save();

    res.json({
      message: "User Created",
    });

    // // Step 1 : Connect the database
    // const connection = await mongoClient.connect(URL);

    // // Step 2 : Select the DB
    // const db = connection.db(DB_NAME);

    // // Step 3 : Select the Collection
    // const collection = db.collection("users");

    // // Step 4 : Do the operation
    // const user = await collection.insertOne(req.body);

    // // Step 5 : Close the connection
    // await connection.close();

    // res.json({
    //   _id: user.insertedId,
    // });
  } catch (error) {
    console.log(error);
  }

  // req.body.id = users.length + 1;
  // users.push(req.body);
  // res.json({
  //   message: "User created",
  // });
});

app.get("/user/:id", authenticate, async (req, res) => {
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

app.put("/user/:id", authenticate, async (req, res) => {
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

app.delete("/user/:id", authenticate, async (req, res) => {
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

app.post("/register", async (req, res) => {
  try {
    // Step 1 : Connect the database
    const connection = await mongoClient.connect(URL);

    // Step 2 : Select the DB
    const db = connection.db(DB_NAME);

    // Step 3 : Select the Collection
    const collection = db.collection("login_users");

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);
    req.body.password = hash;

    await collection.insertOne(req.body);

    res.json({
      message: "User Registered!",
    });

    // Step 5 : Close the connection
    await connection.close();
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    // Step 1 : Connect the database
    const connection = await mongoClient.connect(URL);

    // Step 2 : Select the DB
    const db = connection.db(DB_NAME);

    // Step 3 : Select the Collection
    const collection = db.collection("login_users");

    const user = await collection.findOne({ email: req.body.email });

    // Step 5 : Close the connection
    await connection.close();

    if (!user) {
      res.status(404).json({
        message: "Email/Password Incorect",
      });
    }

    const passwordCompare = bcryptjs.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordCompare) {
      res.status(401).json({
        message: "Email/Password Incorect",
      });
    }

    // Generate Token

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    res.json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

app.listen(8000);

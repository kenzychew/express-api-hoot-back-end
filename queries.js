/*------------------------------- Starter Code -------------------------------*/

const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const connect = async () => {
  // Connect to MongoDB using the MONGODB_URI specified in our .env file.
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Call the runQueries function, which will eventually hold functions to work
  // with data in our db.
  await runQueries();

  // Disconnect our app from MongoDB after our queries run.
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");

  // Close our app, bringing us back to the command line.
  process.exit();
};

const createUsers = async () => {
  const users = await User.create([
    { username: "sss", password: "sss" },
    { username: "kkk", password: "kkk" },
  ]);
  console.log(users);
};

const createHoots = async () => {
  await Hoot.deleteMany({});
  const author = "67ac11ab9b40961dbd03b48b";
  const hoots = await Hoot.create([
    { username: "sss", password: "sss" },
    { username: "kkk", password: "kkk" },
  ]);
  console.log(hoots);
};

const runQueries = async () => {
  console.log("Queries running.");
  // The functions calls to run queries in our db will go here as we write them.
  await createUsers();
};

connect();
/*------------------------------ Query Functions -----------------------------*/

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const URL = process.env.MONGO_URL;

let client;
async function connectClient() {
  if (!client) {
    client = new MongoClient(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  await client.connect();
}

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("codeHubGit");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username: username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = {
      username: username,
      password: hashedPass,
      email: email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);
    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Unable to signup", error.message);
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    await connectClient();

    const db = client.db("codeHubGit");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Unable to login", error.message);
    res.status(500).send("Server error");
  }
};

export const userProfile = async (req, res) => {
  try {
    const _id = req.params.id;
    await connectClient();
    const db = client.db("codeHubGit");
    const usersCollection = db.collection("users");

    const User = await usersCollection.findOne({ _id: new ObjectId(_id) });
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(User);
  } catch (error) {
    console.error("Unable to fetch User", error.message);
    res.status(500).send("Server error");
  }
};

export const updateProfile = async (req, res) => {
  const { email, password } = req.body;
  const _id = req.params.id;
  try {
    await connectClient();
    const db = client.db("codeHubGit");
    const usersCollection = db.collection("users");

    const updatedField = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      updatedField.password = hashedPass;
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: updatedField },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.send("Profile updated");
  } catch (error) {
    console.error("Unable to fetch User", error.message);
    res.status(500).send("Server error");
  }
};

export const deleteProfile = async (req, res) => {
  const _id = req.params.id;
  try {
    await connectClient();
    const db = client.db("codeHubGit");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({ _id: new ObjectId(_id) });
    if (result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User profile deleted" });
  } catch (error) {
    console.error("Unable to fetch User", error.message);
    res.status(500).send("Server error");
  }
};

export const allUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("codeHubGit");
    const usersCollection = db.collection("users");

    const allUsers = await usersCollection.find({}).toArray();
    res.json(allUsers);
  } catch (error) {
    console.error("Unable to fetch Users", error.message);
    res.status(500).send("Server error");
  }
};

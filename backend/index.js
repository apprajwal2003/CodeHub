import express from "express";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";

dotenv.config();

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./controllers/init.js";
import { addRepo } from "./controllers/add.js";
import { commitRepo } from "./controllers/commit.js";
import { pushRepo } from "./controllers/push.js";
import { pullRepo } from "./controllers/pull.js";
import { revertRepo } from "./controllers/revert.js";

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message...>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      const fullMessage = argv.message.join(" ");
      commitRepo(fullMessage);
    }
  )
  .command("push", "Push commits", {}, pushRepo)
  .command("pull", "Pull commits", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need to enter atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURL = process.env.MONGO_URL;
  mongoose
    .connect(mongoURL)
    .then(() => console.log("Connected to mongoDB successfully!"))
    .catch((error) => console.log("Unable to connect!", error));

  app.use(cors({ origin: "*" }));

  app.get("/", (req, res) => {
    res.send("Welcome");
  });

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let user = "test";

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
      user = userId;
      console.log("=====");
      console.log(user);
      console.log("=====");
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

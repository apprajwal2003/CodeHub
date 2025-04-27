import express from "express";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

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
    .then(() => {
      console.log("Connected to mongoDB successfully!");
    })
    .catch((error) => {
      console.log("Unable to connect!", error);
    });
}

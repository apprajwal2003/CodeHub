import express from "express";
import { userRouter } from "./userRouter.js";
import { repoRouter } from "./repositoryRouter.js";
import { issueRouter } from "./issueRouter.js";

const mainRouter = express.Router();

mainRouter.use("/User", userRouter);
mainRouter.use("/Repo", repoRouter);
mainRouter.use("/Issue", issueRouter);
mainRouter.get("/", (req, res) => {
  res.send("Welcome");
});
export { mainRouter };

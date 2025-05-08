import express from "express";
import {
  createRepository,
  deleteRepositoryById,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  getAllRepository,
  toggleVisibilityById,
  updateRepositoryById,
} from "../controllers/repositoryController.js";

const repoRouter = express.Router();

repoRouter.post("/create", createRepository);
repoRouter.get("/getAll", getAllRepository);
repoRouter.get("/fetchById/:id", fetchRepositoryById);
repoRouter.get("/fetchByName/:name", fetchRepositoryByName);
repoRouter.get("/fetchForCurrentUser/:id", fetchRepositoryForCurrentUser);
repoRouter.put("/updateById/:id", updateRepositoryById);
repoRouter.patch("/toggleVisibilityById/:id", toggleVisibilityById);
repoRouter.delete("/deleteById/:id", deleteRepositoryById);

export { repoRouter };

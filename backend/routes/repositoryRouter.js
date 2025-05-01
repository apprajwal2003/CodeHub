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

repoRouter.post("/createRepository", createRepository);
repoRouter.get("/getAllRepository", getAllRepository);
repoRouter.get("/fetchRepositoryById/:id", fetchRepositoryById);
repoRouter.get("/fetchRepositoryByName/:name", fetchRepositoryByName);
repoRouter.get(
  "/fetchRepositoryForCurrentUser/:id",
  fetchRepositoryForCurrentUser
);
repoRouter.put("/updateRepositoryById/:id", updateRepositoryById);
repoRouter.patch("/toggleVisibilityById/:id", toggleVisibilityById);
repoRouter.delete("/deleteRepositoryById/:id", deleteRepositoryById);

export { repoRouter };

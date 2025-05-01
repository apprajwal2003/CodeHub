import express from "express";
import {
  createIssue,
  deleteIssueById,
  getAllIssue,
  getIssueById,
  updateIssueById,
} from "../controllers/issueController.js";

const issueRouter = express.Router();

issueRouter.post("/createIssue", createIssue);
issueRouter.put("/updateIssueById/:id", updateIssueById);
issueRouter.delete("/deleteIssueById/:id", deleteIssueById);
issueRouter.get("/getAllIssue", getAllIssue);
issueRouter.get("/getIssueById/:id", getIssueById);

export { issueRouter };

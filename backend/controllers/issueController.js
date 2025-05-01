import mongoose from "mongoose";
import { Issue } from "../models/issueModel.js";
import { Repository } from "../models/repoModel.js";

export const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  try {
    const issue = new Issue({ title, description, repository: id });

    await issue.save();
    res.status(201).json({ message: "Issue Created", issue });
  } catch (error) {
    console.error("Unable to create Issue", error.message);
    res.status(500).send("Server error");
  }
};

export const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();
    res.json({ message: "Issue Updated", issue });
  } catch (error) {
    console.error("Unable to update Issue", error.message);
    res.status(500).send("Server error");
  }
};

export const deleteIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json({ message: "issue deleted" });
  } catch (error) {
    console.error("Unable to delete Issue", error.message);
    res.status(500).send("Server error");
  }
};

export const getAllIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });
    if (!issues) {
      res.status(404).json({ message: "Issues not found" });
    }
    res.status(200).json({ message: "Issue found", issues });
  } catch (error) {
    console.error("Unable to fetch all issues", error.message);
    res.status(500).send("Server error");
  }
};

export const getIssueById = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json({ message: "Issue found", issue });
  } catch (error) {
    console.error("Unable to find Issue", error.message);
    res.status(500).send("Server error");
  }
};

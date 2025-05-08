import mongoose from "mongoose";
import { Repository } from "../models/repoModel.js";
import { User } from "../models/userModel.js";
import { Issue } from "../models/issueModel.js";
import { ObjectId } from "mongodb";

export const createRepository = async (req, res) => {
  try {
    const { name, description, content, visibility, owner, issues } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userExists = await User.findById(owner);
    if (!userExists) {
      return res.status(404).json({ error: "Invalid user ID" });
    }

    const newRepo = new Repository({
      name,
      description,
      content,
      visibility,
      owner,
      issues,
    });

    const result = await newRepo.save();

    res
      .status(201)
      .json({ message: "Repository created", repositoryID: result._id });
  } catch (error) {
    console.error("Unable to create Repository", error.message);
    res.status(500).send("Server error");
  }
};

export const getAllRepository = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json({ repositories });
  } catch (error) {
    console.error("Unable to fetch all Repositories", error.message);
    res.status(500).send("Server error");
  }
};

export const fetchRepositoryById = async (req, res) => {
  try {
    const repoID = req.params.id;
    const repository = await Repository.find({ _id: repoID })
      .populate("owner")
      .populate("issues");
    res.json({ repository });
  } catch (error) {
    console.error("Unable to fetch Repository by ID", error.message);
    res.status(500).send("Server error");
  }
};

export const fetchRepositoryByName = async (req, res) => {
  try {
    const repoName = req.params.name;
    const repository = await Repository.find({ name: repoName })
      .populate("owner")
      .populate("issues");
    res.json({ repository });
  } catch (error) {
    console.error("Unable to fetch Repository by Name", error.message);
    res.status(500).send("Server error");
  }
};

export const fetchRepositoryForCurrentUser = async (req, res) => {
  try {
    const repoID = req.params.id;
    const repository = await Repository.find({ owner: repoID })
      .populate("owner")
      .populate("issues");
    if (!repository || repository.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    res.json({ message: "Repositories Found", repository });
  } catch (error) {
    console.error("Unable to fetch User Repositories", error.message);
    res.status(500).send("Server error");
  }
};

export const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repositories not found!" });
    }
    repository.content.push(content);
    repository.description = description;
    const updatedRepository = await repository.save();
    res.json({
      message: "Repository Updated successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error("Error during updation", error.message);
    res.status(500).send("Server error");
  }
};

export const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repositories not found!" });
    }

    repository.visibility = !repository.visibility;
    const updatedRepository = await repository.save();

    res.json({
      message: "Repository Toggled successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.error("Error during Toggling visibility", error.message);
    res.status(500).send("Server error");
  }
};

export const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repositories not found!" });
    }

    res.json({
      message: "Repository Deleted successfully",
    });
  } catch (error) {
    console.error("Error during Deleting Repository", error.message);
    res.status(500).send("Server error");
  }
};

import express from "express";
import {
  allUsers,
  signup,
  login,
  userProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.get("/allUsers", allUsers);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/userProfile/:id", userProfile);
userRouter.put("/updateProfile/:id", updateProfile);
userRouter.delete("/deleteProfile/:id", deleteProfile);

export { userRouter };

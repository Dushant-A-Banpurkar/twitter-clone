import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedProfile,
  updateUser
} from "../controllers/user_controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedProfile);
router.get("/follow/:id", protectRoute, followUnfollowUser);
router.get("/update", protectRoute, updateUser);

export default router;

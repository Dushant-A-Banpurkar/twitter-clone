import express from 'express'
import {getMe, login, logout, signup} from "../controllers/auth_controller.js"
import { protectRoute } from '../middleware/protectRoute.js';
protectRoute
const router=express.Router();

//protectRoute for protection
router.get("/me",protectRoute,getMe)

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

export default router;
import User from "../models/user_model.js";
import jwt  from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  try {
    //Check the cookie
    const token = req.cookies.jwt;
    if (!token) {
      res.status(200).json({ error: "Unauthorized: No Token Provided" });
    }
    //if cookie is empty
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(200).json({ error: "Unauthorized: Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(200).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Internal server error user" });
  }
};

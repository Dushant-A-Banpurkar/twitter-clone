import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from '../lib/utils/generateToken.js'

// SignUp
export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    console.log('Request Body:', req.body);

    // Validate input
    if (!fullname || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format!!!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be above 8 digits" });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    console.error("Error in signup controller", error.stack);
    res.status(500).json({ error: "Internal server error user" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);
    
    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.error("Error in login controller", error.stack);
    res.status(500).json({ error: "Internal server error user" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.stack);
    res.status(500).json({ error: "Internal server error user" });
  }
};

// GetMe
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe controller", error.stack);
    res.status(500).json({ error: "Internal server error user" });
  }
};

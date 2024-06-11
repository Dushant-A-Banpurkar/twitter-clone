import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from '../lib/utils/generateToken.js'

//SignUp
export const signup = async (req, res) => {
  try {
    const {fullname, username, email, password,  } = req.body;
    console.log('Request Body:', req.body); 
    // Validate email format
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format!!!" });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Check if email is already taken
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    if(password.length>8){
      return res.status(400).json({error:"Password must be above 8 digit"})
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname,
      username,
      password: hashedpassword,
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
    console.error("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error user" });
  }
};
export const login = async (req, res) => {
  try {
    const {username,password}=req.body;
    const user=await User.findOne({username});
    const isPasswordCorrect=await bcrypt.compare(password, user?.password || "")
    if(!user || !isPasswordCorrect){
      return res.status(400).json({error:"Invalid username or password"})
    }
    generateTokenAndSetCookie(user._id,res);

    res.status(200).json({
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
    console.error("Error in sign controller", error.message);
    res.status(500).json({ error: "Internal server error user" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"logout out successfully"})

  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error user" });
  }
};

export const getMe=async (req,res)=>{
  try {
    const user=await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal server error user" });
  }
}
  
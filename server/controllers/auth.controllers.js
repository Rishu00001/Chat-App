import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/token.js";
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check if the user exist
    const existUsername = await User.findOne({ username });
    if (existUsername) {
      return res.status(400).json({ message: "User already exist" });
    }
    //check using email
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exist" });
    }
    //check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be atleast 6 characters" });
    }

    //hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //Create token using jwt
    let token =  generateToken(newUser._id);

    //parse the token in cookie using cookie-parser
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });
    return res.status(201).json({
      message: "User successfully created",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` });
  }
};
//login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check using email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    //match the input password with real passwoed
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    //Create token using jwt
    let token = generateToken(user._id);

    //parse the token in cookie using cookie-parser
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });
    return res.status(201).json({
      message: "User successfully logged in",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ message: `login error ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
  httpOnly: true,
  secure: false,
  sameSite: "Strict",
});

    return res.status(200).json({ message: "Successfully Logged Out" });
  } catch (error) {
    console.log(error);
  }
};

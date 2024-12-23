import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User  from "../../models/userModel.js";

// Register the User(Student or Professor)
export const signupUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        status: false,
        code: 400,
        data: null,
      });
    }

    // HAsh the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Now create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      status: true,
      code: 201,
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registering user",
      error,
      status: false,
      code: 500,
      data: null,
    });
  }
};

// User Login/Signin
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: false,
        code: 401,
        data: null,
      });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: false,
        code: 401,
        data: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      status: true,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
      status: false,
      code: 500,
      data: null,
    });
  }
};

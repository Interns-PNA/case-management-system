const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("+password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, permission } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Create new user
    const userData = {
      username: username.trim(),
      password,
      permission: permission || "read-only",
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    // Return user without sensitive password hash
    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      permission: savedUser.permission,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { username, permission, password } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (username && username.trim() !== "") {
      user.username = username.trim();
    }

    if (permission) {
      user.permission = permission;
    }

    if (password && password.length >= 6) {
      user.password = password; // Will be hashed by pre-save middleware
    }

    const updatedUser = await user.save();

    // Return user without sensitive data
    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      permission: updatedUser.permission,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Authenticate user (for login)
exports.authenticateUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user by username
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Return user data without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      permission: user.permission,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      message: "Authentication successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({
      message: "Error authenticating user",
      error: error.message,
    });
  }
};

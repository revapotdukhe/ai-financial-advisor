const User = require("../models/User");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password });

    await newUser.save();

    res.send("USER REGISTERED ✅");
  } catch (error) {
    res.send(error.message);
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.send("User not found");

    if (user.password !== password)
      return res.send("Wrong password");

    res.send("Login successful");
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { registerUser, loginUser };
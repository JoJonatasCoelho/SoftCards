const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return null; 
  }
  return await User.create({ name, email, password: hashedPassword });
}

async function authenticateUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) return null;
  const user = await User.findOne({ refreshToken });
  if (!user) return null;
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { accessToken: newAccessToken };
  } catch (err) {
    return null;
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  refreshAccessToken,
};
const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModels");

module.exports.userVerification = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) {
    // Redirect to the unauthorized page with a message
    return res.status(401).json({ message: "Unauthorized" });
  }

  let data;
  try {
    data = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }

  const user = await User.findById(data.id);

  if (user) {
    req.user = user;
    next();
  } else {
    // Redirect to the unauthorized page with a message
    return res.status(401).json({ message: "Unauthorized" });
  }
};

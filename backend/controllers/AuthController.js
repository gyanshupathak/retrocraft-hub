const { User  } = require("../models/UserModels");
const { createSecretToken } = require("../utils/SecretTokens");
const bcrypt = require("bcrypt");
const Token = require("../models/UserToken");



//SIGNUP LOGIC
module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, createdAt , role } = req.body;
    if (password.length < 6) {
      return res.json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, createdAt, role });
    const token = createSecretToken(user._id , user.role);

    res.status(201).json({ message: "User created successfully", success: true ,  user: {_id:user._id} , token:token });
    
    next();
  } catch (error) {
    console.error(error);
  }
};

//LOGIN LOGIC 
module.exports.Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password ){
        return res.json({message:'All fields are required'})
      }

      if (password.length < 6) {
        return res.json({ message: "Password must be at least 6 characters long" });
      }
      
      const user = await User.findOne({ email });
      if(!user){
        return res.json({message:'Incorrect password or email' }) 
      }
      const auth = await bcrypt.compare(password,user.password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
       const token = createSecretToken(user._id , user.role);
       res.status(201).json({ message: "User logged in successfully", success: true , role:user.role , user: {_id:user._id} , token:token });
    } catch (error) {
      console.error(error);
    }
  };



const express = require("express");
const router = express.Router();
const {userVerification} = require("../middleawares/AuthMiddleWare")
const { Profile , updateProfile ,updateProducerProfile ,getProducerProfile, createProducerProfile  } = require ("../controllers/ProfileControllers");  

router.get("/getprofile/:userId",userVerification ,Profile);
router.put("/update/:userId",userVerification ,updateProfile);
router.post("/createproducerprofile",userVerification ,createProducerProfile);
router.put("/updateproducerprofile/:userId",userVerification,updateProducerProfile)
router.get("/getproducerprofile/:userId",userVerification ,getProducerProfile);


module.exports = router;
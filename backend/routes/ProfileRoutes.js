const express = require("express");
const router = express.Router();
const {userVerification} = require("../middleawares/AuthMiddleWare")
const { Profile , updateProfile ,ProducerProfile ,getProducerProfile,   } = require ("../controllers/ProfileControllers");  

router.get("/getprofile/:userId",userVerification ,Profile);
router.put("/update/:userId",userVerification ,updateProfile);
router.post("/producerprofile/:userId",userVerification,ProducerProfile)
router.get("/getproducerprofile/:userId",userVerification ,getProducerProfile);


module.exports = router;
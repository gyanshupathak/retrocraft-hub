const express = require("express");
const router = express.Router();
const {userVerification} = require("../middleawares/AuthMiddleWare")
const { GetPeople } = require ("../controllers/GetPeopleControllers");  

router.get("/getpeople",userVerification ,GetPeople);

module.exports = router;
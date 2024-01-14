const { userVerification } = require("../middleawares/AuthMiddleWare");
const { User, validate } = require("../models/UserModels");
const express = require("express");
const router = express.Router();

router.post("/",userVerification , async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await new User(req.body).save();

        res.send(user);
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

module.exports = router;
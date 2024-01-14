const { Signup , Login } = require("../controllers/AuthController");
const router = require("express").Router();
const { userVerification  } = require("../middleawares/AuthMiddleWare");
const { Description } = require("../controllers/DescriptionController");




router.post("/signup", Signup);
router.post('/login', Login);
router.post('/description',userVerification , Description);



module.exports = router;






const router = require("express").Router();
const {CreateMessage,getMessage} = require("../Controllers/Message");


router.post("/",CreateMessage);
router.get("/:conversationId",getMessage);

module.exports = router;




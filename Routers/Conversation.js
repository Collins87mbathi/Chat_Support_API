const router = require("express").Router();
const {CreateConversation,GetConversations, GetConversation} = require("../Controllers/Conversation");

router.post('/',CreateConversation);
router.get("/:receiverId",GetConversation);

module.exports = router;
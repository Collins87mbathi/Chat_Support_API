const Conversation = require("../Models/Conversation");


const CreateConversation = async (req,res) => {
    try {
        const conversation = await Conversation.findOne({
          members: { $all: [req.body.senderId, req.body.receiverId] },
        });
        if(conversation) {
        res.status(200).json(conversation);
        } else {
            const newConversation = new Conversation({
                members: [req.body.senderId, req.body.receiverId],
              });
              try {
                const savedConversation = await newConversation.save();
                res.status(200).json(savedConversation);
              } catch (err) {
                res.status(500).json(err);
              }
        }
      } catch (err) {
        res.status(500).json(err);
      }
};

const GetConversation = async (req,res) => {
    try {
        const conversation = await Conversation.find({
          members: { $in: [req.params.receiverId] },
        });
        res.status(200).json(conversation);
      } catch (err) {
        res.status(500).json(err);
      }
}


module.exports = {CreateConversation,GetConversation};


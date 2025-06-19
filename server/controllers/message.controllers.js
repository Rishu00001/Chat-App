import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;

    if (!receiver)
      return res.status(400).json({ message: "Receiver is required." });
    if (!message && !req.file)
      return res.status(400).json({ message: "Message or image is required." });

    let image;
    if (req.file?.path) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });
    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender receiver"
    );
    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};

export const getMessage = async (req, res) => {
  let sender = req.userId;
  let { receiver } = req.params;
  if (!sender || !receiver || receiver === "undefined") {
    return res
      .status(400)
      .json({ message: "Sender and receiver are required." });
  }
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(400).json({ message: "Conversation not found" });
    }
    return res.status(200).json(conversation?.messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error || "Something went wrong" });
  }
};

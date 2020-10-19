const express = require("express");
const router = express.Router();
const MessageValidation = require("./MessageValidation");
const Message = require("./models/Message");

// Get list of all messages
router.get("/messages/list", async (req, res) => {
  try {
    const list = await Message.find();
    return res.status(200).json({ list });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Get list of messages. 10 by request
router.get("/messages/list/:index", async (req, res) => {
  const skipAmount = parseInt(req.params.index) * 10;

  try {
    const list = await Message.find()
      .sort({ createdAt: 1 })
      .skip(skipAmount)
      .limit(10)
      .exec();
    if (list.length === 0) {
      return res.status(200).json({ message: "No more messages" });
    } else {
      return res.status(200).json({ list });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Get single message by Id
router.get("/messages/single/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json("No message with such ID");
    } else {
      return res.status(200).json({ message });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Get messages for selected Date range
router.get("/messages/list-in-range/:index", async (req, res) => {
  const dateRegex = new RegExp("^([0-9]{4})/[0-1][0-9]/[0-3][0-9]", "g");

  const start = req.query.startDate?.match(dateRegex);
  const end = req.query.endDate?.match(dateRegex);
  if (!start || !end) {
    return res.status(400).json({ error: "Incorrect range" });
  } else {
    const startDate = new Date(req.query.startDate).toISOString();
    const endDate = new Date(req.query.endDate + " 23:59:59").toISOString();

    try {
      const list = await Message.find()
        .where({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({
          createdAt: 1,
        })
        .skip(req.params.index * 10)
        .limit(10)
        .exec();

      if (list.length === 0) {
        return res.status(200).json({ message: "There are no messages" });
      } else {
        return res.status(200).json({ list });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

// Search by text in Query
router.get("/messages/search", async (req, res) => {
  const regex = new RegExp(req.query.searchParams, "gi");
  try {
    const list = await Message.find().where("text", regex).exec();

    if (list.length === 0) {
      return res.status(200).json({
        message: `There is no messages found with ${req.query.searchParams}`,
      });
    } else {
      return res.status(200).json(list);
    }
  } catch (err) {
    console.log(err);
    return res.statusMessage(500).json({ error: "Sonthing went wrong" });
  }
});

// Post new Message
router.post("/messages/create", async (req, res) => {
  const { valid, errors } = new MessageValidation(req.body).validate();

  if (!valid) {
    return res.status(400).json({ errors });
  } else {
    // DO mongoDB
    const message = new Message({
      author: req.body.author,
      email: req.body.email,
      text: req.body.text,
      createdAt: new Date().toISOString(),
    });
    try {
      const response = await message.save();
      console.log(response);
      return res.status(201).json({ message: "Successfuly created" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

module.exports = router;

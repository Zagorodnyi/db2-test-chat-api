require("dotenv").config();
const mongoose = require("mongoose");

module.exports = startDB = async () => {
  const url = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.8vq3r.mongodb.net/Chat`;

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
};

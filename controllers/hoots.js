const express = require("express");
const router = express.Router();
const Hoot = require("../models/hoot.js");
const verifyToken = require("../middleware/verify-token.js");

router.post("/", verifyToken, async (req, res) => {
  //? req.user comes from verifyToken
  req.body.author = req.user._id; //* getUser(req)
  //   const hoot = await Hoot.create(req.body);
  //   hoot._doc.author = req.user;
  let tmp = await Hoot.create(req.body);
  const hoot = Hoot.findById(tmp._id).populate("author");

  //? hoot = { title: "tt", catgeory: "News", author: "SSS"}
  res.status(201).json(hoot);
});

module.exports = router;

// {
//   "title": "Learn JWT",
//   "text": "Having problems",
//   "category": "Sports",
//   "author": "67ac117d8319363f21d29af3",
//   "_id": "67ac33d80f79290345b332ad",
//   "comments": [],
//   "createdAt": "2025-02-12T05:38:32.396Z",
//   "updatedAt": "2025-02-12T05:38:32.396Z",
//   "__v": 0
// }

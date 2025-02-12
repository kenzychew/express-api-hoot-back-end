const express = require("express");
const router = express.Router();
const Hoot = require("../models/hoot.js");
const verifyToken = require("../middleware/verify-token.js");

const isLowerCase = (str) => str === str.toLowerCase();

router.post("/", verifyToken, async (req, res) => {
  try {
    if (isLowerCase(req.body.title[0])) {
      // res.send(400).json({ err: "1st letter in title needs to upper case" });
      // return;
      throw new Error("1st letter in title needs to upper case");
    }
    //? req.user comes from verifyToken
    req.body.author = req.user._id; //* getUser(req)
    const hoot = await Hoot.create(req.body);
    hoot._doc.author = req.user; //* partial populate

    // let tmp = await Hoot.create(req.body);
    // const hoot = Hoot.findById(tmp._id).populate("author");

    //? hoot = { title: "tt", catgeory: "News", author: "SSS"}
    res.status(201).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(hoots);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:hootId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate("author");
    if (!hoot) {
      throw new Error("Hoot not found");
    }
    res.status(200).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;

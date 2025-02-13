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
    const { hootId } = req.params;
    const hoot = await Hoot.findById(hootId).populate("author");

    if (hoot === null) {
      return res.status(404).json({ err: "Not found" });
    }

    res.json({ hoot });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:hootId", verifyToken, async (req, res) => {
  try {
    const { hootId } = req.params;
    const hoot = await Hoot.findById(hootId);

    if (hoot === null) {
      return res.status(404).json({ err: "Not found" });
    }

    const isNotSameAuthor = !hoot.author.equals(req.user._id);
    if (isNotSameAuthor) {
      return res.status(403).json({ err: "You cannot do this" });
    }

    const updatedHoot = await Hoot.findByIdAndUpdate(hootId, req.body, {
      new: true,
    });
    updatedHoot._doc.author = req.user;
    res.json({ hoot: updatedHoot });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:hootId", async (req, res) => {
  try {
    const { hootId } = req.params;
    const hoot = await Hoot.findById(hootId);

    if (hoot === null) {
      return res.status(404).json({ err: "Not found" });
    }

    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedHoot = await Hoot.findByIdAndDelete(hootId);
    res.json({ hoot: deletedHoot });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;

// Dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  deleteMilestone,
  updateMilestone,
  createMilestone,
  fetchMilestone,
  listMilestone,
} = require("./controllers");

// Param Middleware
router.param("milestoneId", async (req, res, next, milestoneId) => {
  const milestone = await fetchMilestone(milestoneId, next);
  if (milestone) {
    req.milestone = milestone;
    next();
  } else {
    const err = new Error("Milestone Not Found");
    err.status = 404;
    next(err);
  }
});

//Create Milestone Profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createMilestone
);

//Update Milestone Profile
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  updateMilestone
);

//Delete Milestone Profile
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteMilestone
);

//Get All Milestones
router.get("/", listMilestone);

module.exports = router;

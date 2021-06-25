// Dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  deleteParent,
  updateParent,
  createParent,
  fetchParent,
  sendFund,
  listParent,
} = require("./controllers");

// Param Middleware
router.param("parentId", async (req, res, next, parentId) => {
  const parent = await fetchParent(parentId, next);
  if (parent) {
    req.parent = parent;
    next();
  } else {
    const err = new Error("Parent Not Found");
    err.status = 404;
    next(err);
  }
});

//Create Parent Profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createParent
);

// Send Funds to Child
router.put(
  "/sendFunds",
  passport.authenticate("jwt", { session: false }),
  sendFund
);

//Update Parent Profile
router.put("/", passport.authenticate("jwt", { session: false }), updateParent);

//Delete Parent Profile
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteParent
);

router.get("/", listParent);

module.exports = router;

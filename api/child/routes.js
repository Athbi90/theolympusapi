// Dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  deleteChild,
  updateChild,
  createChild,
  fetchChild,
  listChildren,
} = require("./controllers");

// Param Middleware
router.param("childId", async (req, res, next, childId) => {
  const child = await fetchChild(childId, next);
  if (child) {
    req.child = child;
    next();
  } else {
    const err = new Error("child Not Found");
    err.status = 404;
    next(err);
  }
});

//Create Child Profile
router.post("/", passport.authenticate("jwt", { session: false }), createChild);

//Update Child Profile
router.put("/", passport.authenticate("jwt", { session: false }), updateChild);

//Delete Child Profile
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteChild
);

router.get("/", listChildren);
module.exports = router;

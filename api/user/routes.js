// Dependancies
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  signup,
  signin,
  fetchUser,
  userUpdate,
  userDelete,
  listUsers,
} = require("./controllers");

// Param Middleware
router.param("userId", async (req, res, next, userId) => {
  const user = await fetchUser(userId, next);
  if (user) {
    req.user = user;
    next();
  } else {
    const err = new Error("User Not Found");
    err.status = 404;
    next(err);
  }
});
// Sign up "register"
router.post("/signup", signup);

// Sign in "register"
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

// user details
router.get("/", passport.authenticate("jwt", { session: false }), fetchUser);

// List USers
router.get(
  "/listUsers",
  passport.authenticate("jwt", { session: false }),
  listUsers
);

// Deleting Users
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  userDelete
);

// Updating Users
router.put("/", passport.authenticate("jwt", { session: false }), userUpdate);

module.exports = router;

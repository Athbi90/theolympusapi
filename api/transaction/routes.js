// Dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  deleteTransaction,
  updateTransaction,
  createTransaction,
  fetchTransaction,
  listTransaction,
} = require("./controllers");

// Param Middleware
router.param("transactionId", async (req, res, next, transactionId) => {
  const transaction = await fetchTransaction(transactionId, next);
  if (transaction) {
    req.transaction = transaction;
    next();
  } else {
    const err = new Error("Parent Not Found");
    err.status = 404;
    next(err);
  }
});

//Create Transaction Profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createTransaction
);

//Update Transaction Profile
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  updateTransaction
);

//Delete Transaction Profile
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteTransaction
);

//Get All Transactions
router.get("/", listTransaction);

module.exports = router;

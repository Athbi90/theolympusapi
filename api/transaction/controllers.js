const { Transaction, User, Parent, Child } = require("../../db/models");

//fetch transaction
exports.fetchTransaction = async (transactionId, next) => {
  try {
    const transaction = await Transaction.findByPk(transactionId);
    return transaction;
  } catch (err) {
    next(err);
  }
};

//Create Transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const child = await Child.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (req.body.transactionPrice > child.transaction_limit) {
      const newTransaction = await Transaction.create({
        ...req.body,
        parentId: child.parentId,
        childId: child.id,
      });
      res.status(201).json(newTransaction);
    } else if (
      req.body.transacitonPrice <= child.transaction_limit &&
      req.body.transacitonPrice >= child.balance
    ) {
      const newTransaction = await Transaction.create({
        ...req.body,
        parentId: child.parentId,
        childId: child.id,
        is_approved: true,
      });
      child.balance = child.balance - req.body.transacitonPrice;
      res.status(201).json(newTransaction);
    }
  } catch (err) {
    next(err);
  }
};

//Update Transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });

    const transaciton = await Transaction.findOne({
      where: { parentId: parent.id, id: req.body.transactionId },
    });
    const updatedTransaction = await transaciton.update(req.body);
    res.json(updatedTransaction);
  } catch (err) {
    next(err);
  }
};

//Update Transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });

    const transaciton = await Transaction.findOne({
      where: { parentId: parent.id, id: req.body.transactionId },
    });
    await transaciton.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

//List Transactions
exports.listTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

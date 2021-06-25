const { Parent, Child, User } = require("../../db/models");

// Include Convention
const includeOptions = {
  attributes: { exclude: ["createdAt", "updatedAt"] },
  include: [
    {
      model: Child,
      as: "child",
      attributes: ["id"],
    },
  ],
};

// Fetch Parent
exports.fetchParent = async (parentId, next) => {
  try {
    const parent = await Parent.findByPk(parentId, includeOptions);
    return parent;
  } catch (err) {
    next(err);
  }
};

// Create Parent Profile
exports.createParent = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const newParent = await Parent.create(req.body);
    res.status(201).json(newParent);
  } catch (err) {
    next(err);
  }
};

exports.sendFund = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (parent.balance >= req.body.fund) {
      const parentBalance = parent.balance - req.body.fund;
      const child = await Child.findByPk(req.body.childId);
      const childBalance = +child.balance + req.body.fund;
      await parent.update({ balance: parentBalance });
      await child.update({ balance: childBalance });
      res.json(parent);
    }
  } catch (error) {
    next(error);
  }
};

// Update Profile
exports.updateParent = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });
    const updatedProfile = await parent.update(req.body);
    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

// Delete Profile
exports.deleteParent = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });
    await parent.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// List Parent
exports.listParent = async (req, res, next) => {
  try {
    const parents = await Parent.findAll();
    res.json(parents);
  } catch (err) {
    next(err);
  }
};

exports.listChildren = async (req, res, next) => {
  try {
    console.log(req.user);
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });
    const childs = await Child.findAll({
      where: {
        parentId: parent.id,
      },
    });
    res.json(childs);
  } catch (error) {
    next(error);
  }
};

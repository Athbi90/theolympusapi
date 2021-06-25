const { Parent, Child } = require("../../db/models");

// Include Convention
const includeOptions = {
  attributes: { exclude: ["createdAt", "updatedAt"] },
  include: [
    {
      model: Parent,
      as: "parent",
      attributes: ["id"],
    },
  ],
};

// Fetch Child
exports.fetchChild = async (childId, next) => {
  try {
    const child = await Child.findByPk(childId, includeOptions);
    return child;
  } catch (err) {
    next(err);
  }
};

// Create Child Profile
exports.createChild = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (parent.balance >= req.body.balance) {
      const newBalance = parent.balance - req.body.balance;
      parent.update({ balance: newBalance });
      const newChild = await Child.create({ ...req.body, parentId: parent.id });
      parent.addChild(newChild);
      res.status(201).json(newChild);
    }
  } catch (err) {
    next(err);
  }
};

// Update Profile
exports.updateChild = async (req, res, next) => {
  try {
    const child = await Child.findOne({
      where: {
        userId: req.user.id,
      },
    });
    const updatedProfile = await child.update(req.body);
    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

// Delete Profile
exports.deleteChild = async (req, res, next) => {
  try {
    const child = await Child.findOne({
      where: {
        userId: req.user.id,
      },
    });
    await child.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// List Children
exports.listChildren = async (req, res, next) => {
  try {
    const children = await Child.findAll();
    res.json(children);
  } catch (err) {
    next(err);
  }
};

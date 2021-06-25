const { Milestone, User, Parent, Child } = require("../../db/models");

//fetch Milestone
exports.fetchMilestone = async (milestoneId, next) => {
  try {
    const milestone = await Milestone.findByPk(MilestoneId);
    return milestone;
  } catch (err) {
    next(err);
  }
};

//Create MileStone
exports.createMilestone = async (req, res, next) => {
  try {
    const parentId = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });

    const child = await Child.findByPk(req.body.childId);
    const parent = await Parent.findOne({
      where: {
        userId: parentId.id,
      },
    });
    if (parent && child) {
      const newMileStone = await Milestone.create({
        ...req.body,
        parentId: parent.id,
        childId: child.id,
      });
      res.status(201).json(newMileStone);
    }
  } catch (err) {
    next(err);
  }
};

//Update Milestone
exports.updateMilestone = async (req, res, next) => {
  try {
    const parentId = await User.findOne({
      where: {
        username: req.body.parentUsername,
      },
    });

    const parent = await Parent.findOne({
      where: {
        userId: parentId.id,
      },
    });

    const milestone = await Milestone.findOne({
      where: { parentId: parent.id, name: req.body.milestoneName },
    });
    const updatedMilestone = await milestone.update(req.body);
    res.json(updatedMilestone);
  } catch (err) {
    next(err);
  }
};

//Update Milestone
exports.deleteMilestone = async (req, res, next) => {
  try {
    const parentId = await User.findOne({
      where: {
        username: req.body.parentUsername,
      },
    });

    const parent = await Parent.findOne({
      where: {
        userId: parentId.id,
      },
    });

    const milestone = await Milestone.findOne({
      where: { parentId: parent.id, name: req.body.milestoneName },
    });
    await milestone.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

//List Milestones
exports.listMilestone = async (req, res, next) => {
  try {
    const milestones = await Milestone.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(milestones);
  } catch (err) {
    next(err);
  }
};

const { Milestone, Task, User, Parent, Child } = require("../../db/models");

//fetch Task
exports.fetchTask = async (taskId, next) => {
  try {
    const task = await Task.findByPk(taskId);
    return task;
  } catch (err) {
    next(err);
  }
};

//Create Task
exports.createTask = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({
      where: {
        userId: req.user.id,
      },
    });

    const milestone = await Milestone.findOne({
      where: { name: req.body.milestone, parentId: parent.id },
    });

    if (milestone) {
      const newTask = await Task.create({
        ...req.body,
        parentId: parent.id,
        childId: milestone.childId,
        milestoneId: milestone.id,
      });
      res.status(201).json(newTask);
    }
  } catch (err) {
    next(err);
  }
};

//Update Task
exports.updateTask = async (req, res, next) => {
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

    const task = await Task.findOne({
      where: { parentId: parent.id, name: req.body.taskName },
    });
    const updatedTask = await task.update(req.body);
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

// Task Completed
exports.taskCompleted = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.body.taskId);
    const milestone = await Milestone.findByPk(task.milestoneId);
    task.update({ is_completed: true });
    if (task.taskValue >= milestone.totalValue) {
      milestone.update({ totalValue: 0 });
    } else {
      const value = milestone.totalValue - task.taskValue;
      milestone.update({ totalValue: value });
    }
    res.json("Task has been completed");
  } catch (error) {
    next(error);
  }
};

//Delete Task
exports.deleteTask = async (req, res, next) => {
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

    const task = await Task.findOne({
      where: { parentId: parent.id, name: req.body.taskName },
    });
    await task.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

//List Tasks
exports.listTask = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

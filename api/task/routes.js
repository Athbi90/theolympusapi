// Dependencies
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  deleteTask,
  updateTask,
  createTask,
  fetchTask,
  listTask,
  taskCompleted,
} = require("./controllers");

// Param Middleware
router.param("taskId", async (req, res, next, taskId) => {
  const task = await fetchTask(taskId, next);
  if (task) {
    req.task = task;
    next();
  } else {
    const err = new Error("Parent Not Found");
    err.status = 404;
    next(err);
  }
});

//Create Task
router.post("/", passport.authenticate("jwt", { session: false }), createTask);

//Update Task
router.put("/", updateTask);

//Complete Task
router.put(
  "/completeTask",
  passport.authenticate("jwt", { session: false }),
  taskCompleted
);

//Delete Task
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteTask
);

//Get All Tasks
router.get("/", listTask);

module.exports = router;

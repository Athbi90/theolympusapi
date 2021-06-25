// Dependancies
const bcrypt = require("bcrypt");

// Webtoken
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");

const { User, Parent, Child } = require("../../db/models");

//Signup
exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("exports.signup -> hashedPassword", hashedPassword);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      fullname: newUser.fullname,
      dateOfBirth: newUser.dateOfBirth,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token: token });
  } catch (error) {
    next(error);
  }
};

//Signin
exports.signin = async (req, res) => {
  console.log(`Attempting login for ${req.user.username}`);
  const { user } = req;
  const parent = await Parent.findOne({ where: { userId: user.id } });
  const child = await Child.findOne({ where: { userId: user.id } });
  const payload = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
    parentId: parent ? parent.id : null,
    childId: child ? child.id : null,
  };
  console.log(`Attempting login for ${req.user.username}`);
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.json({ token: token });
};

// Check username
exports.checkUsername = async (req, res, next) => {
  try {
    let available = true;
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user) available = false;

    res.json({ available });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.userUpdate = async (req, res, next) => {
  try {
    await req.user.update(req.body);
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.userDelete = async (req, res, next) => {
  try {
    await req.user.destroy();
    res.status(204).json("User has been deleted").end();
  } catch (err) {
    next(err);
  }
};

// Fetch users
exports.fetchUser = async (userId, next) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return user;
  } catch (error) {
    next(error);
  }
};

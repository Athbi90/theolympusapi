"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

///*** Relations */

// User to Parent relation (1-1)
db.User.hasOne(db.Parent, {
  as: "parent",
  foreignKey: {
    name: "userId",
    unique: true,
    msg: "Already Have a Parent Profile",
  },
});
db.Parent.belongsTo(db.User, {
  as: "user",
});

// User to Child relation (1-1)
db.User.hasOne(db.Child, {
  as: "child",
  foreignKey: {
    name: "userId",
    unique: true,
    msg: "Already Have a Parent Profile",
  },
});
db.Child.belongsTo(db.User, {
  as: "user",
});

// Parent to Milestone relation (1-M)
db.Parent.hasMany(db.Milestone, {
  as: "parent",
  foreignKey: {
    name: "parentId",
  },
});
db.Milestone.belongsTo(db.Parent, {
  as: "milestone",
  foreignKey: {
    name: "parentId",
  },
});

// Child to Milestone relation (1-M)
db.Child.hasMany(db.Milestone, {
  as: "child",
  foreignKey: {
    name: "childId",
  },
});
db.Milestone.belongsTo(db.Child, {
  as: "milestoneId",
  foreignKey: {
    name: "childId",
  },
});

// Milestone to Task relation (1-M)
db.Milestone.hasMany(db.Task, {
  as: "task",
  foreignKey: {
    name: "milestoneId",
  },
});
db.Task.belongsTo(db.Milestone, {
  as: "milestone",
  foreignKey: {
    name: "milestoneId",
  },
});

// Child to Transaction relation (1-M)
db.Child.hasMany(db.Transaction, {
  as: "transaction",
  foreignKey: {
    name: "childId",
  },
});
db.Transaction.belongsTo(db.Child, {
  as: "child",
  foreignKey: {
    name: "childId",
  },
});

// Parent to Transaction relation (1-M)
db.Parent.hasMany(db.Transaction, {
  as: "transaction",
  foreignKey: {
    name: "parentId",
  },
});
db.Transaction.belongsTo(db.Parent, {
  as: "parent",
  foreignKey: {
    name: "parentId",
  },
});

// Parent to Child relation (1-M)
db.Parent.hasMany(db.Child, {
  as: "children",
  foreignKey: {
    name: "parentId",
  },
});
db.Child.belongsTo(db.Parent, {
  as: "parent",
  foreignKey: {
    name: "parentId",
  },
});

// Parent to Child relation (M-M)
db.Parent.belongsToMany(db.Child, {
  through: "Family",
  foreignKey: {
    name: "parentId",
  },
});

db.Child.belongsToMany(db.Parent, {
  through: "Family",
  foreignKey: {
    name: "childId",
  },
});
module.exports = db;

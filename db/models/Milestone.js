module.exports = (sequelize, DataTypes) => {
  const Milestone = sequelize.define("Milestone", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    totalValue: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  });
  return Milestone;
};

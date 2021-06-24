module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define("Parent", {
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
    },
    expenses_limit: {
      type: DataTypes.DECIMAL,
    },
  });
  return Parent;
};

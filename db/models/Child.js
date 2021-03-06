module.exports = (sequelize, DataTypes) => {
  const Child = sequelize.define("Child", {
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
    },
    transaction_limit: {
      type: DataTypes.DECIMAL,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Child;
};

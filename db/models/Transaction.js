module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("NOW"),
    },
    is_approved: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  });
  return Transaction;
};

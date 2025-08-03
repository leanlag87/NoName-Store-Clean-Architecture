import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import User from './user';

class Cart extends Model {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Cart.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    totalAmount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: 'Cart',
    paranoid: true,
  }
);


Cart.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
});

export default Cart;
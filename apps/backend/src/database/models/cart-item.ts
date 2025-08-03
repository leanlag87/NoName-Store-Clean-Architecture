import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import Cart from './cart';
import Product from './product';

class CartItem extends Model {
  public id!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;
  public addedAt!: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

CartItem.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    cartId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    productId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    addedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    modelName: 'CartItem',
    paranoid: true,
  }
);

// Asociaciones
CartItem.belongsTo(Cart, {
  as: 'cart',
  foreignKey: 'cartId',
});

CartItem.belongsTo(Product, {
  as: 'product',
  foreignKey: 'productId',
});

export default CartItem;
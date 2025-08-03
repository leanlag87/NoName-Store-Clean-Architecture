import User from './user';
import Product from './product';
import Cart from './cart';
import CartItem from './cart-item';

// User associations
User.hasMany(Cart, {
  as: 'carts',
  foreignKey: 'userId',
});

// Product associations
Product.hasMany(CartItem, {
  as: 'cartItems',
  foreignKey: 'productId',
});

// Cart associations
Cart.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
});

Cart.hasMany(CartItem, {
  as: 'items',
  foreignKey: 'cartId',
});

// CartItem associations
CartItem.belongsTo(Cart, {
  as: 'cart',
  foreignKey: 'cartId',
});

CartItem.belongsTo(Product, {
  as: 'product',
  foreignKey: 'productId',
});

export default {
  User,
  Product,
  Cart,
  CartItem,
};
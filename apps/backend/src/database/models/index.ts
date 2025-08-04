import Cart from "./cart";
import CartItem from "./cart-item";
import Product from "./product";
import User from "./user";

import "./associations";

const models = {
    User,
    Product,
    Cart,
    CartItem,
}

export default models;
export { User, Product, Cart, CartItem };

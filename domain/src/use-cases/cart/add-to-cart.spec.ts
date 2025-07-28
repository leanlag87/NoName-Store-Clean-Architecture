import { beforeEach, describe, expect, test } from "vitest";
import {
  createInvalidDataError,
  createNotFoundError,
} from "../../errors/error";
import {
  MockedCartRepository,
  mockCartRepository,
} from "../../mocks/cart-repository-mock";
import {
  MockedProductRepository,
  mockProductRepository,
} from "../../mocks/product-repository-mock";
import {
  addToCart,
  AddToCartDependencies,
  AddToCartRequestModel,
} from "./add-to-cart";
import {
  MockedUserRepository,
  mockUserRepository,
} from "../../mocks/user-repository-mock";

describe("Add to Cart", () => {
  let _mockedCartRepository: MockedCartRepository = mockCartRepository([]);
  let _mockedProductRepository: MockedProductRepository = mockProductRepository(
    []
  );
  let _mockedUserRepository: MockedUserRepository = mockUserRepository([]);
  let _dependencies: AddToCartDependencies;

  beforeEach(() => {
    _mockedCartRepository = mockCartRepository([]);
    _mockedProductRepository = mockProductRepository([]);
    _mockedUserRepository = mockUserRepository([]);
    _dependencies = {
      cartRepository: _mockedCartRepository,
      productRepository: _mockedProductRepository,
      userRepository: _mockedUserRepository,
    };

    _mockedUserRepository.create({
      email: "user@test.com",
      password: "password123",
      name: "Test User",
    });

    _mockedProductRepository.create({
      name: "Test Product",
      description: "Test Description",
      price: 100,
    });

    _mockedCartRepository.create({
      userId: _mockedUserRepository.users[0].id!,
      items: [],
      totalAmount: 0,
    });
  });

  test("should fail if user does not exist", async () => {
    const payload: AddToCartRequestModel = {
      userId: "non-existent-user",
      productId: _mockedProductRepository.products[0].id,
      quantity: 1,
    };

    const result = await addToCart(_dependencies, payload);
    expect(result).toEqual(createNotFoundError("User not found"));
  });

  test("should add new product to cart successfully", async () => {
    const payload: AddToCartRequestModel = {
      userId: _mockedUserRepository.users[0].id!,
      productId: _mockedProductRepository.products[0].id,
      quantity: 2,
    };

    const result = await addToCart(_dependencies, payload);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("productId", payload.productId);
    expect(result).toHaveProperty("quantity", 2);
    expect(result).toHaveProperty("price", 100);
  });

  test("should fail if product does not exist", async () => {
    const payload: AddToCartRequestModel = {
      userId: _mockedUserRepository.users[0].id!,
      productId: "non-existent-product",
      quantity: 1,
    };

    const result = await addToCart(_dependencies, payload);
    expect(result).toEqual(createNotFoundError("Product not found"));
  });

  test("should fail if quantity is zero or negative", async () => {
    const payload: AddToCartRequestModel = {
      userId: _mockedUserRepository.users[0].id!,
      productId: _mockedProductRepository.products[0].id,
      quantity: 0,
    };

    const result = await addToCart(_dependencies, payload);
    expect(result).toEqual(
      createInvalidDataError("Quantity must be greater than zero")
    );
  });

  test("should update quantity if product already exists in cart", async () => {
    const productId = _mockedProductRepository.products[0].id;
    const userId = _mockedUserRepository.users[0].id!;

    await addToCart(_dependencies, {
      userId,
      productId,
      quantity: 1,
    });

    const result = await addToCart(_dependencies, {
      userId,
      productId,
      quantity: 2,
    });

    expect(result).toHaveProperty("quantity", 3);
  });

  test("should create new cart if user doesn't have one", async () => {
    const newUser = await _mockedUserRepository.create({
      email: "newuser@test.com",
      password: "password123",
      name: "New User",
    });

    const payload: AddToCartRequestModel = {
      userId: newUser.id!,
      productId: _mockedProductRepository.products[0].id,
      quantity: 1,
    };

    const result = await addToCart(_dependencies, payload);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("productId", payload.productId);

    const cart = await _mockedCartRepository.findByUserId(newUser.id!);
    expect(cart).not.toBeNull();
    expect(cart!.items).toHaveLength(1);
  });
});

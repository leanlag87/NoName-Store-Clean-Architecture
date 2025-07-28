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

describe("Add to Cart", () => {
  let _mockedCartRepository: MockedCartRepository = mockCartRepository([]);
  let _mockedProductRepository: MockedProductRepository = mockProductRepository(
    []
  );
  let _dependencies: AddToCartDependencies;

  beforeEach(() => {
    _mockedCartRepository = mockCartRepository([]);
    _mockedProductRepository = mockProductRepository([]);
    _dependencies = {
      cartRepository: _mockedCartRepository,
      productRepository: _mockedProductRepository,
    };

    _mockedProductRepository.create({
      name: "Test Product",
      description: "Test Description",
      price: 100,
    });

    _mockedCartRepository.create({
      userId: "user-1",
      items: [],
      totalAmount: 0,
    });
  });

  test("should add new product to cart successfully", async () => {
    const payload: AddToCartRequestModel = {
      userId: "user-1",
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
      userId: "user-1",
      productId: "non-existent-product",
      quantity: 1,
    };

    const result = await addToCart(_dependencies, payload);
    expect(result).toEqual(createNotFoundError("Product not found"));
  });

  test("should fail if quantity is zero or negative", async () => {
    const payload: AddToCartRequestModel = {
      userId: "user-1",
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

    await addToCart(_dependencies, {
      userId: "user-1",
      productId,
      quantity: 1,
    });

    const result = await addToCart(_dependencies, {
      userId: "user-1",
      productId,
      quantity: 2,
    });

    expect(result).toHaveProperty("quantity", 3);
  });

  test("should create new cart if user doesn't have one", async () => {
    const payload: AddToCartRequestModel = {
      userId: "user-without-cart",
      productId: _mockedProductRepository.products[0].id,
      quantity: 1,
    };

    const result = await addToCart(_dependencies, payload);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("productId", payload.productId);

    const cart = await _mockedCartRepository.findByUserId("user-without-cart");
    expect(cart).not.toBeNull();
    expect(cart!.items).toHaveLength(1);
  });
});

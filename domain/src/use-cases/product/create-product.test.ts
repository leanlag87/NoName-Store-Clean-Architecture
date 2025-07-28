import { beforeEach, describe, expect, test } from "vitest";
import { createInvalidDataError } from "../../errors/error";
import {
  MockedProductRepository,
  mockProductRepository,
} from "../../mocks/product-repository-mock";
import {
  createProduct,
  CreateProductDependencies,
  CreateProductRequestModel,
} from "./create.product";

describe("Create Product", () => {
  let _mockedProductRepository: MockedProductRepository = mockProductRepository(
    []
  );
  let _dependencies: CreateProductDependencies;

  beforeEach(() => {
    _mockedProductRepository = mockProductRepository([]);
    _dependencies = {
      productRepository: _mockedProductRepository,
    };
  });

  test("should create new product successfully", async () => {
    const payload: CreateProductRequestModel = {
      name: "new-product",
      description: "new-description",
      price: 100,
    };
    const result = await createProduct(_dependencies, payload);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name", "new-product");
    expect(result).toHaveProperty("description", "new-description");
    expect(result).toHaveProperty("price", 100);
  });

  test("should throw error when name is empty", async () => {
    const payload: CreateProductRequestModel = {
      name: "",
      description: "new-description",
      price: 100,
    };
    const result = await createProduct(_dependencies, payload);
    expect(result).toEqual(createInvalidDataError("Name must be not empty"));
  });

  test("should throw error when name is too long", async () => {
    const payload: CreateProductRequestModel = {
      name: "a".repeat(21),
      description: "new-description",
      price: 100,
    };
    const result = await createProduct(_dependencies, payload);
    expect(result).toEqual(
      createInvalidDataError("Name cannot be longer than 20 characters")
    );
  });

  test("should throw error when description is too long", async () => {
    const payload: CreateProductRequestModel = {
      name: "valid-name",
      description: "a".repeat(501),
      price: 100,
    };
    const result = await createProduct(_dependencies, payload);
    expect(result).toEqual(
      createInvalidDataError("Description cannot be longer than 500 characters")
    );
  });

  test("should throw error when price is zero or negative", async () => {
    const payload: CreateProductRequestModel = {
      name: "valid-name",
      description: "valid-description",
      price: 0,
    };
    const result = await createProduct(_dependencies, payload);
    expect(result).toEqual(
      createInvalidDataError("Price must be greater than zero")
    );
  });
});

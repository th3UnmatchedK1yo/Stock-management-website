"use client";

import {
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
  Product,
  NewProduct
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

const handleCreateProduct = async (productData: NewProduct) => {
  await createProduct({
  productId: uuidv4(),
  name: productData.name,
  price: productData.price,
  stockQuantity: productData.stockQuantity,
  rating: productData.rating,
});

    refetch();
    setIsModalOpen(false);
  };

  const handleEditProduct = async (updatedData: Partial<Product>) => {
    if (!selectedProduct) return;
    await updateProduct({
      productId: selectedProduct.productId,
      data: updatedData,
    });
    refetch();
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) return <div className="py-4">Loading...</div>;
  if (isError || !products)
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex item-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <div className="flex space-x-2">
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              if (!selectedProduct) {
                alert("Please select a product to edit!");
                return;
              }
              setIsEditModalOpen(true);
            }}
          >
            <PencilIcon className="w-5 h-5 mr-2 !text-gray-200" /> Edit Product
          </button>
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
            Product
          </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between"
        onClick={() => setSelectedProduct(null)} // click outside to deselect
      >
        {products.map((product) => (
          <div
            key={product.productId}
            className={`border shadow rounded-md p-4 max-w-full w-full mx-auto cursor-pointer ${
              selectedProduct?.productId === product.productId
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation(); // prevent background click
              setSelectedProduct(product);
            }}
          >
            <div className="flex flex-col items-center">
              <Image
                src={`/assets/products/product${
                  Math.floor(Math.random() * 3) + 1
                }.png`}
                alt={product.name}
                width={150}
                height={150}
                className="mb-3 rounded-2xl w-36 h-36"
              />
              <h3 className="text-lg text-gray-900 font-semibold">
                {product.name}
              </h3>
              <p className="text-gray-800">${product.price.toFixed(2)}</p>
              <div className="text-sm text-gray-600 mt-1">
                Stock: {product.stockQuantity}
              </div>
              {product.rating && (
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        mode="create"
      />
      <CreateProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCreate={handleEditProduct}
        initialData={selectedProduct}
        mode="edit"
      />
    </div>
  );
};

export default Products;

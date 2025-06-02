"use client";

import { useGetProductsQuery, useDeleteProductMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Trash2Icon } from "lucide-react";

const Inventory = () => {
  const { data: products, isError, isLoading, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      refetch(); // Refresh the product list after deletion
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product.");
    }
  };

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 200 },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      type: "number",
      valueGetter: (value, row) => `$${row.price}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      type: "number",
      valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 150,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleDelete(params.row.productId)}
          className="flex items-center bg-white text-red-600 border border-red-600 hover:bg-red-100 px-3 py-1 rounded"
        >
          <Trash2Icon className="w-4 h-4 mr-1" />
          Delete
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Inventory;

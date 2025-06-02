import { Router } from "express";
import { createProduct, getProducts, deleteProduct, updateProduct } from '../controllers/productController';
const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

export default router;
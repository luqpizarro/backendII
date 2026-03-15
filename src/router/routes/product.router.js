import { Router } from "express";
import { productController as ctrl } from "../../controllers/product.controller.js";
import { policies } from "../../middleware/policies.middleware.js";
import { requireJwtCookie } from "../../middleware/auth.middleware.js";

const router = Router()
router.use(requireJwtCookie)

// Cualquier usuario logueado puede ver productos
router.get('/api/products', (req, res) => ctrl.list(req, res))
router.get('/api/products/:id', (req, res) => ctrl.getById(req, res))

// Solo admin puede crear, editar y eliminar
router.post('/api/products', policies('admin'), (req, res) => ctrl.create(req, res))
router.put('/api/products/:id', policies('admin'), (req, res) => ctrl.update(req, res))
router.delete('/api/products/:id', policies('admin'), (req, res) => ctrl.remove(req, res))

// Semilla
router.post('/api/products/seed', policies('admin'), (req, res) => ctrl.seed(req, res))

export default router
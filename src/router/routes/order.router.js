import { Router } from 'express';
// import { requireJWTCookie } from "../../middleware/auth.middleware.js";
import { policies } from "../../middleware/policies.middleware.js";
import { orderController as ctrl } from '../../controllers/order.controller.js';

const router = Router()
// router.use(requireJWTCookie) -> si se crea un login y todo eso se puede usar esto, para revisar

//Vistas
router.get('/orders', (req, res) => ctrl.listView(req, res))

//API REST
router.get('/api/orders', (req, res) => ctrl.listJSON(req, res))
router.get('/api/orders/:id', policies('admin', 'user'), (req, res) => ctrl.getById(req, res))
router.get('/api/orders/:code', policies('admin', 'user'), (req, res) => ctrl.getByCode(req, res))
router.post('/api/orders', policies('admin'), (req, res) => ctrl.create(req, res))
router.put('/api/orders/:id', policies('admin'), (req, res) => ctrl.update(req, res))
router.delete('/api/orders/:id', policies('admin'), (req, res) => ctrl.remove(req, res))
 
//Seed
router.post('/api/orders/seed', (req, res) => ctrl.seed(req, res))


export default router;
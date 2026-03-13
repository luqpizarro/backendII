import { Router } from "express";
import { ticketController as ctrl } from "../../controllers/ticket.controller.js";
import { policies } from "../../middelware/policies.middelware.js";
import { requireJwtCookie } from "../../middelware/auth.middelware.js";

const router = Router()

router.use(requireJwtCookie)

// Solo el usuario puede comprar
router.post('/api/tickets/purchase', policies('user'), (req, res) => ctrl.purchase(req, res))

// El usuario y admin puede ver sus propios tickets
router.get('/api/tickets/my-tickets', policies('user', 'admin'), (req, res) => ctrl.getByPurchaser(req, res))

export default router
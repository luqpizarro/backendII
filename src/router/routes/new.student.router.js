import { Router } from "express";

import { requireJwtCookie } from '../../middelware/auth.middelware.js';
import { policies } from '../../middelware/policies.middelware.js';
import { studentController as ctrl } from '../../controllers/student.controller.js';


const router = Router();
router.use(requireJwtCookie) // Usar el middleware de forma global, cada cosa que se haga va a tener que validar que estes loggeado

router.get('/', ctrl.list)
router.get('/:id', policies('admin', 'user'), ctrl.get)
router.post('/', policies('admin'), ctrl.create)
router.put('/:id', policies('admin'), ctrl.update)
router.delete('/:id', policies('admin'), ctrl.remove)

export default router;
import { Router } from "express";
import { userController as ctrl } from "../../controllers/user.controller.js";
import { requireJwtCookie, requireManyRoles } from "../../middelware/auth.middelware.js";

const router = new Router();

router.post('/register', (req, res) => ctrl.register(req, res))
router.post('/login', (req, res) => ctrl.login(req, res))
router.get('/current', requireJwtCookie, requireManyRoles("admin", "user"), (req, res) => ctrl.current(req, res))
router.post('/logout', requireJwtCookie, (req, res) => ctrl.logout(req, res))

//Recuperacion de contraseña
router.post('/forgot-password', (req, res) => ctrl.forgotPassword(req, res))
router.post('/reset-password', (req, res) => ctrl.resetPassword(req, res))
router.get('/reset-password', (req, res) => ctrl.showResetForm(req, res))

export default router;
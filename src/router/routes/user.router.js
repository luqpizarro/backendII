import { Router } from "express";
import { userController as ctrl } from "../../controllers/user.controller.js";
import { requireLogin, alreadyLogin } from "../../middelware/auth.middelware.js";

const router = new Router()

router.post('/register', alreadyLogin, (req, res) => ctrl.register(req, res))
router.post('/login', alreadyLogin, (req, res) => ctrl.login(req, res))
router.post('/logout', requireLogin, (req, res) => ctrl.logout(req, res))
router.get('/', requireLogin, (req, res) => ctrl.list(req, res))

export default router;
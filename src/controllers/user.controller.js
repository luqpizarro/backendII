import { userService as svc } from '../services/user.service.js'
import { mailerService } from '../services/mailer.service.js'
import { toCreateUserDTO, toUserResponseDTO } from '../models/dto/user.dto.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

class UserController {
    async register(req, res) {
        try {
            const dto = toCreateUserDTO(req.body)
            const exists = await svc.getByEmail(dto.email)
            if (exists) return res.status(400).json({ error: `The email ${dto.email} is already in use` })

            const hash = await bcrypt.hash(dto.password, 10)
            const user = await svc.create({ ...dto, password: hash })
            res.status(201).json({ message: 'User created', user: toUserResponseDTO(user) })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) return res.status(400).json({ error: 'All fields are mandatory' })

            const user = await svc.getByEmail(email)
            if (!user) return res.status(400).json({ error: 'Invalid credentials' })

            const ok = await bcrypt.compare(password, user.password)
            if (!ok) return res.status(400).json({ error: 'Invalid credentials' })

            const payload = {sub: String(user._id), email: user.email, role: user.role};
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});

            //Agregar la cookie httpOnly
            res.cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 60 * 60 * 1000,
                path: '/'
            })
            res.status(200).json({ message: "Login OK (JWT in cookie)", user: toUserResponseDTO(user), token})
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async current(req, res) {
        try {
            const user = await svc.getById(req.user._id)
            if (!user) return res.status(404).json({ error: 'User not founded' })
            res.status(200).json({ user: toUserResponseDTO(user) })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async logout(req, res) {
        try {
                res.clearCookie('connect.sid', { path: '/' })
                res.status(200).json({ message: 'See you' })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async list(req, res) {
        try {
            const users = await svc.getAll()
            res.status(200).json({ users })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body
            if (!email) return res.status(400).json({ error: 'The email is mandatory' })

            // 1. Buscar el usuario
            const user = await svc.getByEmail(email)
            if (!user) return res.status(404).json({ error: 'Account does not exist' })

            // 2. Generar token
            const token = jwt.sign(
                { sub: String(user._id), email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )

            // 3. Armar el link con el token
            const resetUrl = `${process.env.BASE_URL}/api/auth-jwt/reset-password?token=${token}`

            // 4. Mandar email
            await mailerService.send({
                to: user.email,
                subject: 'Password recovery',
                template: 'reset-password',
                context: {
                    name: user.first_name,
                    resetUrl
                }
            })

            res.status(200).json({ message: 'Recovery email sent' })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async resetPassword(req, res) {
        try {
            // 1. Obtiene el token de la URL y la nueva contraseña del body
            const { token } = req.query
            const { newPassword } = req.body

            if (!token || !newPassword) {
                return res.status(400).json({ error: 'Token and new password are mandatory' })
            }

            // 2. Verifica que el token sea válido y no haya expirado
            let payload
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET)
            } catch (err) {
                return res.status(401).json({ error: 'Invalid Link' })
            }

            // 3. Busca el usuario
            const user = await svc.getById(payload.sub)
            if (!user) return res.status(404).json({ error: 'User not founded' })

            // 4. Verifica que la nueva contraseña no sea igual a la anterior
            const isSame = await bcrypt.compare(newPassword, user.password)
            if (isSame) {
                return res.status(400).json({ error: 'The password must not be the same' })
            }

            // 5. Hashea y guarda la nueva contraseña
            const hash = await bcrypt.hash(newPassword, 10)
            await svc.update(payload.sub, { password: hash })

            res.status(200).json({ message: 'Password updated' })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async showResetForm(req, res) {
        try {
            const { token } = req.query
            if (!token) return res.status(400).json({ error: 'Token required' })

            // Verificamos que el token sea válido antes de mostrar el formulario
            try {
                jwt.verify(token, process.env.JWT_SECRET)
            } catch (err) {
                return res.status(401).render('error', { message: 'invalid link' })
            }

            res.render('form/reset-password-form', { token })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export const userController = new UserController()
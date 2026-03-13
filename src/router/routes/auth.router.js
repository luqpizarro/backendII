import { Router } from "express";
import { User } from "../../models/users.model.js";
import bcrypt from "bcrypt"
import { requireLogin, alreadyLogin, requireJWT } from "../../middelware/auth.middelware.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = new Router();


//Registro de usuario Local (hash con bycript)
router.post('/register', alreadyLogin, async (req, res) => {
    try {
        const {first_name, last_name, email, password, age, role} = req.body

        if( !first_name || !last_name || !email || !password || !age ) {
            res.status(400).json({error: "all fields are required"})
        }

        const exist = await User.findOne({email})
        if(exist) return res.status(400).json({error: `The email ${email} exist`})

        const hash = await bcrypt.hash(password, 10)
            
        const user = new User(({first_name, last_name, email, password: hash, age, role}))
        await user.save()
        res.status(201).json({message: `User created`, user: user})
    } catch (err) {
        res.status(500).json({error: err.message})
    }   
});

//Login con passport
router.post('/login', alreadyLogin, async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || 'Invalid Credentials' });

        req.logIn(user, {session: true}, (err2) => {
            if (err2) return next(err2);
            req.session.user = user;
            return res.status(200).json({ message: ' Login OK (session)', user: user})
        })
    })(req, res, next)
});

//Logout con passport
router.post('/logout', requireLogin, async (req, res, next) => {
    //Evitar que passport regenere la sesion (req.session)
    req.logout({keepSessionInfo: true}, (err) => {
        if (err) return next(err);

        //Destruir la sesion
        if(req.session) {
            req.session.destroy((err2) => {
                if (err2) return next(err2)
                //Limpiar la cookie
                res.clearCookie('connect.sid')
                return res.status(201).json({ message: 'Logout Succesfull (without active session)'})
            })
        }
    })
});

router.get('/current', requireLogin, (req, res) => {
    res.status(200).json({ user: req.session.user})
});

// Estrategia de GitHub, 3 enrutadores: 1 Logger, 2 Callback y 3 si falla
router.get('/github', passport.authenticate('github', {scope: ["user:email"]}))
router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: "/api/github/fail"}), 
    (req, res) => {
        req.session.user = req.user;
        res.status(200).json({ message: "login Ok (gitHub", user: req.user})
    }
)
router.get('/github/fail', (req, res) => {
    res.status(401).json({ error: "gitHub Outh fail"})
})

//JWT
router.post('/jwt/login', async (req, res) => {
    const {email, password} = req.body;

    const u = await User.findOne({email});
    if (!u || !u.password) return res.status(400).json({ error: "Invalid Credentials"});

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ error: "Invalid Credentials"});

    const payload = { sub: String(u._id), email: u.email, role: u.role};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.status(200).json({ mesagge: "Login Ok (JWT)", user: u, token});
});

router.get('/jwt/me', requireJWT, async (req, res) => {
    const u = await User.findById(req.jwt.sub).lean()
    console.log(u)
    if(!u) return res.status(404).json({ error: "Not Found"});
    const { first_name, last_name, email, age, role } = u;
    res.json ({first_name, last_name, email, age, role}) 
})

export default router;
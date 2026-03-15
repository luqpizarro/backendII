import jwt from 'jsonwebtoken'
import passport from 'passport';

export function requireLogin(req, res, next) {
    if(!req.session.user){
        return res.status(401).json({error: 'not authorized'})
    }

    next();
}

export function alreadyLogin(req, res, next) {
    if(req.session.user){
        return res.status(403).json({error: 'already logged'})
    }

    next()
}

//Autorizacion por role
export function requireRole (role) {
    return (req, res, next) => {
        const user = req.session?.user || req.user // Session o Passport
        if(!user) return res.status(401).json({error: 'not authorized'})
        if(user.role !== role) return res.status(403).json({error: "Forbbiden"})
        next()
    }
}

//Require passport-jwt leyendo la cookie de access_token
export const requireJwtCookie = passport.authenticate('jwt-cookie', {session: false})

//Autorizacion por roles
export function requireManyRoles (...roles) {
    return (req, res, next) => {
        if(!req.user) return res.status(401).json({error: "Not Authorized"});
        if(!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbbiden"});
        next();
    }
}

export function requireJWT (req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null
    if (!token) return res.status(401).json({error: 'not authorized', token: "Not exist"})
    
     try {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET)
        next()
     } catch (err) {
        return res.status(401).json({error: 'not authorized' + err.message, token: "Invalid Token"})
     }   
}
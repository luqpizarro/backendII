import express from "express";
import { initRouter } from "../router/router.js";

// Import variables de entorno
import environment, {validateEnv} from '../config/env/env.config.js'

// Data Base
import { connectAuto } from "./../config/db/connect.config.js";
import { initPassport } from "./../config/auth/passport.config.js";

//Middelware
import logger from "./../middelware/logger.middelware.js";

//Session
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import passport from "passport";

//Handlebars
import { engine } from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import { hbsHelpers } from './hbs.helper.js'

const app = express();
const PORT = environment.PORT 
const SECRET_SESSION = environment.SECRET_SESSION

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger)
app.use(cookieParser(SECRET_SESSION))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startServer = async () => {

    // validamos antes de hacer conexion a la base de datos, para ver que todas las variables de entorno existan
    validateEnv()

    //Conectamos a la DB
    await connectAuto()

    const store = MongoStore.create({
        client: ((await import("mongoose")).default.connection.getClient()),
        ttl: 60 * 60
    })
    // Generar la cookie
    app.use(
        session({
            secret: SECRET_SESSION,
            resave: false, 
            saveUninitialized: false,
            store,
            cookie: {
                maxAge: 1 * 60 * 60 * 1000, //1hs
                httpOnly: true,
                signed: true
            }
        })
    )

    //Inicializar Passport
    initPassport()
    app.use(passport.initialize());
    app.use(passport.session())


    // Rutas de Handlebars
    app.engine('handlebars', engine({
        defaultLayout: 'main',
        layoutDir: path.join(__dirname, '../views/layouts'),
        helpers: hbsHelpers,
    }))
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, '../views'));

    //Inicializar Router
    initRouter(app)

    // Manejo de señales y errores globales
    process.on('unhandledRejection', (reason) => {
        console.error('[process] Unhandled Rejection ', reason);
    });

    process.on('uncaughtException', (err) => {
        console.error('[process] Uncaught Exception ', err);
    });

    process.on('SIGINT', () => {
        console.log('\n[process] SIGINT recibido. Cerrando...');
        process.exit(0);
    });

    app.listen(PORT, () => {console.log(`Servidor escuchando desde http://localhost:${PORT}`)})
}

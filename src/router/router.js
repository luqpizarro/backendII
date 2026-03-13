//Routers
import homeRouter from './routes/home.router.js'
import studentRouter from './routes/student.router.js'
import userRouter from './routes/user.router.js'
import profileRouter from './routes/profile.router.js'
import authRouter from './routes/auth.router.js'
import authJwtRouter from './routes/jwt.router.js'
import apiV1Router from './routes/api.v1.router.js'
import advancedRouter from './routes/advanced.router.js'
import processRouter from './routes/process.router.js'
import newStudent from './routes/new.student.router.js'
import orderRouter from './routes/order.router.js'
import messagesRouter from './routes/messaging.router.js'
import emailRouter from './routes/mailer.router.js'
import productRouter from './routes/product.router.js'
import ticketRouter from './routes/ticket.router.js'


export function initRouter (app) {
    // app.use('/', homeRouter);
    app.use('/students', studentRouter);
    app.use('/auth', userRouter);
    app.use('/auth/me', profileRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/auth-jwt', authJwtRouter);

    //Enrutadores avanzados y subenrutadores -> Clase 3Feb2026
    app.use('/api/v1', apiV1Router);
    app.use('/advanced', advancedRouter);
    app.use('/process', processRouter);

    // Enrutador avanzado con controlador
    app.use('/new-student', newStudent);

    // Enrutador para orders
    app.use('/', orderRouter)

    // Enrutador de mensajes
    app.use('/', messagesRouter)

    // Enrutador de emails
    app.use('/', emailRouter)

    // Enrutador de productos
    app.use('/', productRouter)

    // Enrutador de ticket
    app.use('/', ticketRouter)

    //Enrutador para manejar el 404
    app.use((req, res) => {
        res.status(404).json({ error: 'Page Not Found'})
    })
}
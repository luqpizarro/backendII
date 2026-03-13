import CustomRouter from "../custom/CustomRouter.js";
import { requireJwtCookie } from "../../middelware/auth.middelware.js";
import { policies } from "../../middelware/policies.middelware.js";
import { Student } from "../../models/students.model.js";

const router = new CustomRouter({mergeParams: true}); 

//Loader de parametros, carga los ids o los parametros antes de la ejecucion de cualquier ruta (Params Loader)
router.params('id', async (req, res, next, id) => {
    try {
        const s = await Student.findById(id).lean()
        req.studentLoader = s || null;
    } catch (_) {
        req.studentLoader = null
    }
    next();
})

//Ruta con middleware en cadena (orden claro): auth -> politica de roles -> handler
router.get('/students/:id', requireJwtCookie, policies('admin', 'user'), (req, res) => {
    if (!req.studentLoader) return res.status(404).json({ error: "Student Not found.! (pre-cargado)" });
    res.status(200).json({loadedByParams: true, student: req.studentLoader});
})

//Enrutador por grupo, PING
router.group('/v1', (v1) => {
    v1.get('/ping', (req, res) => res.json({ok: true, version: 'v1'}))
});

//subrouter anidado usando merge params: /students/:id/courses
router.group('/students/:id', (sub) => {
    sub.get('/courses', requireJwtCookie, (req, res) => {
        res.json({
            studentId: req.params.id,
            student: req.studentLoader,
            note: 'Ejemplo para sub router con Merge Params',
            courses: ['JS Avanzado', 'Backend', 'SQL Avanzado', 'MongoDB']
        })
    })
})

//enrouteador asincrono con error (a proposito), capturado automaticamente por custom router
router.get('/boom', async (req, res) =>{
    throw new Error ('Explosion controlada para demo de manejo de errores async')
})


export default router.router;
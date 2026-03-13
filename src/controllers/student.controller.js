import mongoose from "mongoose";
import { StudentService } from "../services/student.service.js";
import { toCreateStudentDTO, toUpdateStudentDTO } from "../models/dto/student.dto.js";

const svc = new StudentService(); // tenemos acceso a todos los servicios, inyecta todo los metodos del servicio en el controlador dandole acceso a todos ellos

export const studentController = {
    list: async (_req, res, next) => {
        try {
            res.status(200).json(await svc.list())
        } catch (err) {
            next(err)
        }
    },
    get: async (req, res, next) => {
        try {
            const { id } = req.params
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID'})
        
            const doc = await svc.getById(id)
            return doc ? res.status(200).json(doc) : res.status(404).json({ error: 'Student does not exist'})
        } catch (err) {
            next(err)
        }         
    },
    create: async (req, res, next) => {
        try {
            const dto = toCreateStudentDTO(req.body)
            if(await svc.exist(dto.email)) return res.status(400).json({ error: `The email ${dto.email} exist by another user`})
            const created = await svc.create(dto)
            res.status(201).json({ student: created })
        } catch (err) {
            next(err)
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = req.params
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID'})

            const dto = toUpdateStudentDTO (req.body)
            const out = await svc.update(id, dto)
            return out ? res.status(200).json({ student: out}) : res.status(404).json({ error: 'Student does not exist'})
        } catch (err) {
            next(err)
        }
    },
    remove: async (req, res, next) => {
        try {
            const { id } = req.params
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID'})

            const doc = await svc.delete(id)
            return doc ? res.status(204).end() : res.status(404).json({ error: 'Student does not exist'})
        } catch (err) {
            next(err)
        }
    }

}
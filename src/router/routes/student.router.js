import { Router } from "express";
import { Student } from "../../models/students.model.js";
import mongoose from "mongoose";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({"students": students})

    } catch (err) {
        res.status(500).json({ error: err.message})
    }
});

router.post('/', async (req, res) => {
    try {
        let {name, last_name, email, age} = req.body;
        if(!name ||!last_name || !email || !age){

            res.status(400).json({error: "Todos los campos son obligatorios"})
        }

        email = String(email).trim().toLowerCase();
        const emailUse = await Student.exists({email})
        if(emailUse) {
            res.status(400).json({error: "Email en uso"})
        }

        const student = new Student({name, last_name, email, age})
        await student.save()

        res.status(201).json({message: "Estudiante creado con exito", student: student})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({error: 'Formato de ID no valido'})
        }

        const student = await Student.findById(req.params.id)
        if(!student) return res.status(404).json({error: `El estudiante con ID ${req.params.id} no existe`})
        res.status(200).json({'student': student})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.put('/:id', async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({error: 'Formato de ID no valido'})
        }

        let {name, last_name, email, age} = req.body;
        if(!name ||!last_name || !email || !age){
            res.status(400).json({error: "Todos los campos son obligatorios"})
        }

        email = String(email).trim().toLowerCase();
        const emailUse = await Student.exists({email})
        if(emailUse) {
            res.status(400).json({error: "Email en uso"})
        }

        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!student) return res.status(404).json({error: `El estudiante con ID ${req.params.id} no existe`})
        res.status(200).json({'student': student})

    } catch (err) {
        res.status(500).json({error: err.message})        
    }
})

router.delete('/:id', async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({error: 'Formato de ID no valido'})
        }

        const student = await Student.findByIdAndDelete(req.params.id)
        if(!student) return res.status(404).json({error: `El estudiante con ID ${req.params.id} no existe`})
        res.status(200).json({'student': student})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router;
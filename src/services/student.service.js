//Se va a encargar de contener a los servicios y a la estructura el servicio se encarga de la logica de negocios, el que se comunica con la base de atos, esto implica dos cosas, primero envia la solicitud y la respuesta la envia a quien corresponde.
//Se encarga de comunicarse con la base de datos
//Se encarga de comunicarse con una capa extra que se llame repositorio
//3 capas: repositorio, con la base de datos y el servicio, el servicio se encarga de recibir una consulta del controlado y pasarsela al repositorio, controlador, simplemente da respuestas al cliente

import { Student } from '../models/students.model.js'

export class StudentService {
    async list() {return Student.find()}
    async getById(id) {return Student.findById(id)}
    async create(dto) {return Student.create(dto)}
    async update (id, dto) {return Student.findByIdAndUpdate(id, dto, {new: true})}
    async delete (id) {return !!(await Student.findByIdAndDelete(id))}
    async exist (email) {return Student.exists({email})}
}
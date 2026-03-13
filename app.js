import { startServer } from "./src/server/server.app.js";

await startServer()

// Patrón Repository

//  Crear src/repositories/order.repository.js
//  Crear src/repositories/user.repository.js
//  Refactorizar OrderService para usar el Repository

// DTO

//  Crear src/models/dto/user.dto.js
//  Aplicarlo en /current

// Recuperación de contraseña

//  Endpoint POST /api/auth-jwt/forgot-password
//  Template de email reset-password.handlebars
//  Endpoint POST /api/auth-jwt/reset-password
//  Validar token JWT con expiración de 1 hora
//  Validar que la nueva contraseña no sea igual a la anterior

// Ticket + lógica de compra

//  Crear modelo Ticket (code, purchase_datetime, amount, purchaser)
//  Crear ticket.mongo.dao.js
//  Lógica de compra con verificación de stock
//  Manejar compras parciales (productos sin stock quedan en carrito)

// Roles en productos

//  Crear modelo Product si no existe
//  Aplicar policies('admin') en crear/editar/eliminar productos
//  Aplicar policies('user') en agregar al carrito

// Fixes menores

//  Corregir router.get('current' → router.get('/current'
//  Corregir context: {name: name || usuario} en mailer.controller.js



// Controller -> service -> repository -> DAO
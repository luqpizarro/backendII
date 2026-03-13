import { TicketRepository } from "../repositories/ticket.repository.js";

export class TicketService {
    constructor(repository = new TicketRepository()) {
        this.repository = repository
    }

    async getById(id) { return await this.repository.findById(id) }
    async getByCode(code) { return await this.repository.findByCode(code) }
    async getByPurchaser(email) { return await this.repository.findByPurchaser(email) }
    async create(data) { return await this.repository.save(data) }
    async delete(id) { return await this.repository.delete(id) }

    // Genera un código único para el ticket
    generateCode() {
        return `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    }
}

export const ticketService = new TicketService()
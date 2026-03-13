import { TicketMongoDAO } from "../dao/ticket.mongo.dao.js";

export class TicketRepository {
    constructor(dao = new TicketMongoDAO()) {
        this.dao = dao
    }

    async findById(id) { return await this.dao.getById(id) }
    async findByCode(code) { return await this.dao.findByCode(code) }
    async findByPurchaser(email) { return await this.dao.findByPurchaser(email) }
    async save(data) { return await this.dao.create(data) }
    async delete(id) { return await this.dao.deleteById(id) }
}

export const ticketRepository = new TicketRepository()
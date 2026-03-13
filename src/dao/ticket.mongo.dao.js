import { BaseDAO } from "./base.dao.js";
import { Ticket } from "../models/ticket.mode.js";

export class TicketMongoDAO extends BaseDAO {
    constructor() { super(Ticket) }

    async findByCode(code) {
        return await this.model.findOne({code}).lean()
    }

    async findByPurchaser(email) {
        return await this.model.find({purchaser: email}).lean()
    }
}

export const ticketMongoDAO = new TicketMongoDAO()
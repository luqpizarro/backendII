import { OrderRepository } from '../repositories/order.repository.js'

export class OrderService {
    constructor(repository = new OrderRepository()) {
        this.repository = repository
    }

    async list(params) { return await this.repository.findAll(params) }
    async get(id) { return await this.repository.findById(id) }
    async getByCode(code) { return await this.repository.findByCode(code) }
    async create(data) { return await this.repository.save(data) }
    async update(id, data) { return await this.repository.update(id, data) }
    async remove(id) { return await this.repository.delete(id) }
}

export const orderService = new OrderService()
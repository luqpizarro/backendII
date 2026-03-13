import { OrderMongoDAO } from "../dao/order.mongo.dao.js";

export class OrderRepository {
    constructor(dao = new OrderMongoDAO()) {this.dao = dao}

    async findAll(params) { return await this.dao.listPaginated(params) }
    async findById(id) { return await this.dao.getById(id) }
    async findByCode(code) { return await this.dao.getByCode(code) }
    async save(data) { return await this.dao.create(data) }
    async update(id, data) { return await this.dao.updateById(id, data) }
    async delete(id) { return await this.dao.deleteById(id) }
}

export const orderRepository = new OrderRepository()

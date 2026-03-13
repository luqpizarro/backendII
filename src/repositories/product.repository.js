import { ProductMongoDAO } from "../dao/product.mongo.dao.js";

export class ProductRepository {
    constructor(dao = new ProductMongoDAO()) {
        this.dao = dao
    }

    async findAll() { return await this.dao.getAll() }
    async findById(id) { return await this.dao.getById(id) }
    async findByCategory(category) { return await this.dao.findByCategory(category) }
    async save(data) { return await this.dao.create(data) }
    async update(id, data) { return await this.dao.updateById(id, data) }
    async updateStock(id, quantity) { return await this.dao.updateStock(id, quantity) }
    async delete(id) { return await this.dao.deleteById(id) }
}

export const productRepository = new ProductRepository()
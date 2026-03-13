import { ProductRepository } from "../repositories/product.repository.js";

export class ProductService {
    constructor(repository = new ProductRepository()) {
        this.repository = repository
    }

    async getAll() { return await this.repository.findAll() }
    async getById(id) { return await this.repository.findById(id) }
    async getByCategory(category) { return await this.repository.findByCategory(category) }
    async create(data) { return await this.repository.save(data) }
    async update(id, data) { return await this.repository.update(id, data) }
    async updateStock(id, quantity) { return await this.repository.updateStock(id, quantity) }
    async remove(id) { return await this.repository.delete(id) }

    // Verifica si hay suficiente stock
    async hasStock(id, quantity) {
        const product = await this.repository.findById(id)
        if (!product) return false
        return product.stock >= quantity
    }
}

export const productService = new ProductService()
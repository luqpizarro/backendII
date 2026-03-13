import { BaseDAO } from "./base.dao.js";
import { Product } from "../models/product.model.js";

export class ProductMongoDAO extends BaseDAO {
    constructor() { super(Product) }

    async findByCategory(category) {
        return await this.model.find({ category }).lean()
    }

    async updateStock(id, quantity) {
        return await this.model.findByIdAndUpdate(
            id,
            { $inc: { stock: -quantity } },
            { new: true }
        ).lean()
    }
}

export const productMongoDAO = new ProductMongoDAO()
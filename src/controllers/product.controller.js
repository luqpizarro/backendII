import { productService as svc } from "../services/product.service.js";

class ProductController {
    async list(req, res) {
        try {
            const products = await svc.getAll()
            res.status(200).json({ products })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async getById(req, res) {
        try {
            const product = await svc.getById(req.params.id)
            if (!product) return res.status(404).json({ error: 'Product not found' })
            res.status(200).json({ product })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async create(req, res) {
        try {
            const product = await svc.create(req.body)
            res.status(201).json({ product })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async update(req, res) {
        try {
            const product = await svc.update(req.params.id, req.body)
            if (!product) return res.status(404).json({ error: 'Product not found' })
            res.status(200).json({ product })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async remove(req, res) {
        try {
            const product = await svc.remove(req.params.id)
            if (!product) return res.status(404).json({ error: 'Product not found' })
            res.status(204).end()
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    // Semilla para poder probar
    async seed(req, res) {
        try {
            const count = await svc.getAll()
            if (count.length > 0) return res.status(200).json({ message: 'Ya hay productos, no se plantó la semilla' })
            const sample = [
                { title: 'Mecanic Keyboard', description: 'RGB Keyboard', price: 15000, stock: 10, category: 'periferic' },
                { title: 'Mouse Gamer', description: 'Mouse 1600 DPI', price: 8000, stock: 5, category: 'periferic' },
                { title: 'Monitor 24"', description: 'Monitor Full HD', price: 80000, stock: 3, category: 'monitors' },
            ]
            const created = await Promise.all(sample.map(p => svc.create(p)))
            res.status(201).json({ products: created, inserted: created.length })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export const productController = new ProductController()
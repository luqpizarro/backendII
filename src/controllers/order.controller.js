import { orderService as svc } from "../services/order.service.js";

class OrderController {
    //vistas con handlebars
    async listView(req, res) {
        try {
            const page = Number(req.query.page || 1)
            const limit = Number(req.query.limit || 10)
            const status = req.query.status
            const data = await svc.list({ page, limit, status })
            res.status(200).render("orders/index", {
                title: "Orders",
                orders: data.items,
                pagination: { page: data.page, pages: data.pages, total: data.total, limit: data.limit },
                currentStatus: status || "all"
            })
        } catch (err) {
            console.error("[OrderController.listView] ", err)
            res.status(500).json({ message: "Error Cargando las ordenes", error: err })
        }
    }

    // API JSON
    async listJSON(req, res) {
        try {
            const page = Number(req.query.page || 1)
            const limit = Number(req.query.limit || 10)
            const status = req.query.status
            const data = await svc.list({ page, limit, status })
            res.status(200).json(data)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async getById(req, res) {
        try {
            const o = await svc.get(req.params.id)
            if (!o) return res.status(404).json({ error: "Order not found" })
            res.status(200).json({ order: o })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async getByCode(req, res) {
        try {
            const o = await svc.getByCode(req.params.code)
            if (!o) return res.status(404).json({ error: "Order not found" })
            res.status(200).json({ order: o })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async create(req, res) {
        try {
            const o = await svc.create(req.body) //crear dto para la crear la compra
            res.status(201).json({ order: o })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async update(req, res) {
        try {
            const o = await svc.update(req.params.id, req.body)
            if (!o) return res.status(404).json({ error: "Order not found" })
            res.status(200).json({ order: o })            
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async remove(req, res) {
        try {
            const o = await svc.remove(req.params.id)
            if (!o) return res.status(404).json({ error: "Order not found" })
            res.status(204).end()              
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    //Metodo semilla para poder empezar a usar los metodos (SEMILLA RAPIDA)
    async seed(req, res) {
        try {
            const count = await svc.dao.count()
            if (count > 0) return res.status(200).json({ message: "Ya hay ordenes, no se planto la semilla"})
            const sample = [
                {
                    code: "A-1001", buyerName: "Juan Perez", buyerEmail: "juan@mail.com",
                    items: [
                        { title: "Teclado", qty: 2, unitPrice: 15000},
                        { title: "Mouse", qty: 1, unitPrice: 1000},
                    ], status: "pending"
                },
                {
                    code: "A-1002", buyerName: "Ana Garcia", buyerEmail: "ana@mail.com",
                    items: [
                        { title: "Monitor", qty: 1, unitPrice: 10000},
                        { title: "Mouse", qty: 1, unitPrice: 1000},
                    ], status: "paid"
                }
            ]
            const created = await Promise.all(sample.map(s => svc.create(s)))
            res.status(201).json({ order: created, inserted: created.length})
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export const orderController = new OrderController()
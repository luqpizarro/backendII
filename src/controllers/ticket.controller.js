import { ticketService } from "../services/ticket.service.js";
import { productService } from "../services/product.service.js";

class TicketController {
    async purchase(req, res) {
        try {
            // 1. Recibir los items y el usuario logueado
            const { items } = req.body
            const purchaser = req.user.email

            if (!items || items.length === 0) {
                return res.status(400).json({ error: 'No products in the cart' })
            }

            const successItems = []  // productos que sí se pudieron comprar
            const failedItems = []   // productos que no tienen stock

            // 2. Verificar stock por cada producto
            for (const item of items) {
                const { productId, quantity } = item

                const product = await productService.getById(productId)
                if (!product) {
                    failedItems.push({ productId, reason: 'Product not found' })
                    continue
                }

                const hasStock = await productService.hasStock(productId, quantity)
                if (!hasStock) {
                    // 4. Sin stock → va a failedItems
                    failedItems.push({ productId, title: product.title, reason: 'Without stock' })
                    continue
                }

                // 3. Con stock → descontamos y agregamos a successItems
                await productService.updateStock(productId, quantity)
                successItems.push({
                    productId,
                    title: product.title,
                    quantity,
                    unitPrice: product.price,
                    subtotal: product.price * quantity
                })
            }

            // 5. Si no hubo ningún producto con stock
            if (successItems.length === 0) {
                return res.status(400).json({
                    error: 'Without stock',
                    failedItems
                })
            }

            // 6. Calcular el total y generar el ticket
            const amount = successItems.reduce((acc, item) => acc + item.subtotal, 0)
            const ticket = await ticketService.create({
                code: ticketService.generateCode(),
                purchase_datetime: new Date(),
                amount,
                purchaser
            })

            res.status(201).json({
                message: 'Purchase succesfull',
                ticket,
                successItems,
                failedItems
            })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    async getByPurchaser(req, res) {
        try {
            const tickets = await ticketService.getByPurchaser(req.user.email)
            res.status(200).json({ tickets })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

export const ticketController = new TicketController()
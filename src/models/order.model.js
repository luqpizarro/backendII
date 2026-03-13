import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
    title: {type: String, required: true},
    qty: {type: Number, required: true, min: 1},
    unitPrice: {type: Number, required: true, min: 0}
}, {_id: false});

const orderSchema = new mongoose.Schema({
    code: {type: String, required: true, unique: true, index: true},
    buyerName: {type: String, required: true},
    buyerEmail: {type: String, required: true},
    items: { type: [orderItemSchema], default: [] },
    total: {type: Number, min: 0, default: 0},
    status: {type: String, enum: ['pending', 'paid', 'delivered', 'cancelled'], default: 'pending', index: true}
}, {timestamps: true});

//1. Caluclar total Antes de Validar (cubre create)
orderSchema.pre('validate', function() {
    const items = Array.isArray(this.items) ? this.items: []
    this.total = items.reduce((acc, it) => acc + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 0)
})


//2. Calcular total en updates cuando cambian los items (cubre updates)
orderSchema.pre('findByIdAndUpdate', function() {
    const update = this.getUpdate() || {}
    //Si vienen los items en update recalculamos
    if (update.items) {
        const items = Array.isArray(update.items) ? update.items: []
        update.total = items.reduce((acc, it) => acc + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 0)
        this.setUpdate(update)
    }
})

export const Order = mongoose.model('Order', orderSchema)
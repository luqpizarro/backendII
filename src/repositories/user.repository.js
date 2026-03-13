import { UserMongoDAO } from '../dao/user.mongo.dao.js'

export class UserRepository {
    constructor(dao = new UserMongoDAO()) {
        this.dao = dao
    }

    async findById(id) { return await this.dao.getById(id) }
    async findByEmail(email) { return await this.dao.findByEmail(email) }
    async save(data) { return await this.dao.create(data) }
    async update(id, data) { return await this.dao.updateById(id, data) }
    async delete(id) { return await this.dao.deleteById(id) }
    async findAll() { return await this.dao.getAll() }
}

export const userRepository = new UserRepository()
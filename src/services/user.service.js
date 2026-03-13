import { UserRepository } from '../repositories/user.repository.js'

export class UserService {
    constructor(repository = new UserRepository()) {
        this.repository = repository
    }

    async getById(id) { return await this.repository.findById(id) }
    async getByEmail(email) { return await this.repository.findByEmail(email) }
    async create(data) { return await this.repository.save(data) }
    async update(id, data) { return await this.repository.update(id, data) }
    async delete(id) { return await this.repository.delete(id) }
    async getAll() { return await this.repository.findAll() }
}

export const userService = new UserService()
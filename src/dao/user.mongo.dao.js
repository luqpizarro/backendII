import { BaseDAO } from './base.dao.js'
import { User } from '../models/users.model.js'

export class UserMongoDAO extends BaseDAO {
    constructor() { super(User) }

    async findByEmail(email) {
        return await this.model.findOne({ email }).lean()
    }
}

export const userMongoDAO = new UserMongoDAO()
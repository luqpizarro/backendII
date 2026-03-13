// DTO de entrada: valida y filtra lo que llega al crear un usuario
export function toCreateUserDTO(body) {
    const { first_name, last_name, email, password, age, role } = body ?? {}

    if (!first_name || !last_name || !email || !password || typeof age !== 'number') {
        throw new Error('All fields are mandatory')
    }
    return {
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
        email: String(email).trim().toLowerCase(),
        password,
        age: Number(age),
        role: role || 'user'
    }
}

// DTO de salida: filtra lo que se devuelve al cliente (sin datos sensibles)
export function toUserResponseDTO(user) {
    return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
    }
}
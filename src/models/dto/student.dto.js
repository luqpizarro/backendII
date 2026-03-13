export function toCreateStudentDTO(body) {
    const { name, email, age, last_name } = body ?? {};

    if ( !name || !last_name || !email || typeof age !== 'number') {
        throw new Error('Incorrect Payload');
    };
    const normalizedEmail = String(email).trim().toLowerCase();
    return { name, email: normalizedEmail, age, last_name };
};

export function toUpdateStudentDTO(body) {
    const out = {};
    if (body?.name) out.name = body.name;
    if (body?.email) out.email = String(body.email).trim().toLowerCase();
    if (typeof body?.age === 'number') out.age = body.age

    return out;
}
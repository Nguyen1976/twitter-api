
export class InvalidTokenError extends Error {
    constructor(message: string = 'Invalid or expired token') {
        super(message)
        this.name = 'InvalidTokenError'
    }
}
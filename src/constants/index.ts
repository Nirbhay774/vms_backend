export enum UserRole {
    FINANCE = 'FINANCE',
    VENDOR = 'VENDOR',
    OPS = 'OPS',
}

export enum PayoutStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    APPROVED = 'APPROVED',
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
    REJECTED = 'REJECTED',
}

export enum StatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export const ErrorMessages = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User with this email already exists',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found',
    INTERNAL_SERVER_ERROR: 'Something went wrong',
};

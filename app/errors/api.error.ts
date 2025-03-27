import { APIResponseStatuses } from "../enums/api-response-statuses.enum";

export class APIError extends Error {
    constructor(message: string, public readonly status: APIResponseStatuses) {
        super(message);
    }
}

export class APIBadRequestError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.BAD_REQUEST);
    }
}

export class APIUnauthorizedError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.UNAUTHORIZED);
    }
}

export class APIForbiddenError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.FORBIDDEN);
    }
}

export class APIConflictError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.CONFLICT);
    }
}

export class APINotFoundError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.NOT_FOUND);
    }
}

export class APIUnprocessableEntityError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.UNPROCESSABLE_ENTITY);
    }
}

export class APITooManyRequestsError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.TOO_MANY_REQUESTS);
    }
}

export class APIInternalServerError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.INTERNAL_SERVER_ERROR);
    }
}

export class APIBadGatewayError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.BAD_GATEWAY);
    }
}

export class APIServiceUnavailableError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.SERVICE_UNAVAILABLE);
    }
}

export class APIGatewayTimeoutError extends APIError {
    constructor(message: string) {
        super(message, APIResponseStatuses.GATEWAY_TIMEOUT);
    }
}
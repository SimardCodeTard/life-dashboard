import { APIResponseStatuses } from "../enums/api-response-statuses.enum";

class APIErrorImpl extends Error {
    constructor(message: string, public readonly status: APIResponseStatuses) {
        super(message);
    }
}

export interface APIError extends Error {
    status: APIResponseStatuses;
}

export class APIBadRequestError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.BAD_REQUEST);
    }
}

export class APIUnauthorizedError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.UNAUTHORIZED);
    }
}

export class APIForbiddenError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.FORBIDDEN);
    }
}

export class APINotFoundError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.NOT_FOUND);
    }
}

export class APIUnprocessableEntityError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.UNPROCESSABLE_ENTITY);
    }
}

export class APITooManyRequestsError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.TOO_MANY_REQUESTS);
    }
}

export class APIInternalServerError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.INTERNAL_SERVER_ERROR);
    }
}

export class APIBadGatewayError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.BAD_GATEWAY);
    }
}

export class APIServiceUnavailableError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.SERVICE_UNAVAILABLE);
    }
}

export class APIGatewayTimeoutError extends APIErrorImpl {
    constructor(message: string) {
        super(message, APIResponseStatuses.GATEWAY_TIMEOUT);
    }
}
export const STATUS_CODE = {
    CONTINUE: 100,
    SWITCHING_PROTOCOL:101,
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION:203,
    //The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.[
    No_Content: 204, //The server successfully processed the request, and is not returning any content.
    Multiple_Choices: 300,
    Moved_PERMANENTLY: 301,
    Moved_TEMPORARILY: 302,
    POST_REDIRECT: 303,
    NOT_MODIFIED: 304,
    TEMPORARILY_REDIRECT: 307,
    PERMANENTLY_REDIRECT: 308,
    NOT_FOUND: 404,      // User not Found
    UNAUTHORIZE: 401,     // Login first
    FORBIDDEN: 403, // Access denied your role is not access this
    CONFLICT: 409, // Duplicate Resource -->> email already exits
    UNPROCESSABLE_ENTITY: 422,  // Validation Error
    METHOD_NOT_ALLOWED: 405,
    RESOURCES_DELETED: 410,
    TOO_MANY_REQUEST: 429,
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    BAD_REQUEST: 400, 
    SERVICE_UNAVAILABLE: 503,
}
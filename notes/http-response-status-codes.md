---
title: "HTTP Response Status Codes"
type: note
---

Exist to communicate the result of a request in a standardized way.

- Helps the client understand whether a request succeeded.
- Helps the client handle errors, because each status code maps to a specific category.
    - Authorization error
    - Bad request error
    - And so on
- Standardization enables consistent behavior across clients, languages, and frameworks.

---

### Types of status codes

#### 1xx — Informational

- **Range:** 100–199
- **Meaning:** The server has received the request headers and the client can continue.
- **Common use cases:**
    - Large uploads where the client sends headers first, then the body.
    - Switching protocols.

#### 2xx — Success

- **Range:** 200–299
- **Meaning:** The request was received, understood, and successfully processed.
- **200 OK**
    - The request succeeded.
    - The server is returning the requested resource, or confirming the requested operation.
- **201 Created**
    - The request succeeded and created a new resource.
    - Common with `POST` requests.
- **204 No Content**
    - The request succeeded, but there is no response body.
    - Common with `OPTIONS` preflight responses.

#### 3xx — Redirection

- **Range:** 300–399
- **Meaning:** The client needs to take additional action to complete the request.
- **301 Moved Permanently**
    - The resource has moved permanently to a new URL.
    - The client should use the new URL going forward.
- **302 Found (Temporary Redirect)**
    - The resource is temporarily at a different URL.
    - The client should keep using the original URL for future requests.
- **304 Not Modified**
    - The resource has not changed since the last request.
    - Used for efficient caching, typically with `GET` requests.

#### 4xx — Client Error

- **Range:** 400–499
- **Meaning:** The request cannot be fulfilled because of an issue with the client’s request.
- **400 Bad Request**
    - The client sent invalid, illogical, or incorrectly formatted data.
    - Example: Server expects a number but the client sends an array.
- **401 Unauthorized**
    - Authentication is required and is missing or invalid.
    - Example: Missing token, or an expired JWT.
- **403 Forbidden**
    - The server understood the request, but refuses to authorize it.
    - Can happen even when the client is authenticated.
        - Example: The user is signed in but lacks required permissions.
- **404 Not Found**
    - The requested resource does not exist.
    - Example: Incorrect URL, or the resource was deleted.
- **405 Method Not Allowed**
    - The HTTP method is not supported for this endpoint.
    - Example: `PUT` to an endpoint that only supports `GET` or `POST`.
- **409 Conflict**
    - The request conflicts with the current state of the server.
    - Example: Creating a folder with a name that must be unique, but it already exists.
- **429 Too Many Requests**
    - The client has sent too many requests in a given amount of time.
    - Commonly used for rate limiting.

#### 5xx — Server Error

- **Range:** 500–599
- **Meaning:** The server failed to fulfill an apparently valid request.
- **500 Internal Server Error**
    - An unexpected condition occurred on the server.
    - Example: An unhandled exception.
- **501 Not Implemented**
    - The server does not support the requested functionality.
    - May be implemented in the future.
- **502 Bad Gateway**
    - A proxy or gateway received an invalid response from an upstream server.
    - Common with reverse proxies like NGINX.
- **503 Service Unavailable**
    - The server is down, overloaded, or in maintenance mode.
- **504 Gateway Timeout**
    - A proxy or gateway did not receive a response from the upstream server in time.
    - Example: NGINX timed out waiting for the origin server.
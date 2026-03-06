---
title: "Routing"
type: note
---

HTTP Methods describe the intent and express the what of the request

- whether do u want to fetch/delete and so on

Routing describes:

- where you want to perform this operation
- Which resource do you want to perform something

Routing is basically mapping URL parameters to a server-side logic

The method and the route are like a key which map to a particular handler in the server.

- GET /api/books and POST /api/books are two different routes, even though we have /api/books in common

Static Routes:

- do not have any variable parameters in the route
- like /api/books

Dynamic Routes:

- has data being passed to the server to get a specific response
- The ID part being passed is called a route parameter or path parameter
- It is a part of the route itself
- like /api/users/123
    - where 123 is the id of the user
    - r.get(”/api/users/:id”)

- We also have query parameters
- like GET /api/search?query=some+value
- In post requests or put request we use the body of the request to send some data. But in GET requests, we don’t have a body in REST APIs. So if we want to send some data to the server, we can use query parameters.
- We can send a set of key-value pairs in a request to send some metadata
- Path parameters serve as a semantic expression.

Nested Routes:

- /api/users/123/posts/456
- fetch post with id 456 for the user with id 123
- fetching different information at different levels

Route Versioning and Deprecation

- GET /api/v1/products or GET /api/v2/products
- Why do we need versioning:
    - If we have some new requirements for which we need to modify the response format, instead of changing the entire route, we can add a new version, where in v2 you can adhere to the new requirements while retaining the original response as well
    - Later, you can eventually deprecate v1 so that devs have a window to migrate from v1 to v2.
    - Allows a stable and complete workflow to add breaking changes to endpoints using versioning.

Catch-all route

- If we request to GET /api/v3/products while the server does not serve this endpoint, we can use catch-all handling to send a user-friendly message saying things like “Route not found.”
- we define this route as /*, which basically means anything other than the endpoints we have should be routed to this endpoint.
- This is like defining a default in switch cases
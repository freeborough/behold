BEHOLD VTT: ARCHITECTURE
========================

## System Context

The only third-party service we interact with at this stage is an email sending service.  Which
specific service this is will be a per-install configuration.

![C4 System Context Diagram](./images/c4-context.drawio.svg)

## Containers

While the WebSocket and REST APIs will be embedded together in a single process initially, I've
pulled them out separately here to clearly show that they are two distinct elements and that we will
likely break them out as such in the future for scaling.

Rather than using a third-party service directly, we're instead going through a message queue to
help us with things like: immediately getting back to the player, deal with service downtime,
service mocking for testing, rate limiting, and more.

![C4 Container Diagram](./images/c4-containers.drawio.svg)

## Components

Note that both the REST API and WebSocket API use the shared Database API, however in each diagram I
have included the parts of the Database API that each component uses, and not done a separate
diagram for the Database API specifically as it wouldn't tell us anything new.

### REST API

![REST API: C4 Components Diagram](./images/c4-components-rest.drawio.svg)

### WebSocket API

![WebSocket API: C4 Components Diagram](./images/c4-components-websocket.drawio.svg)

### Email Worker

![Email Worker: C4 Components Diagram](./images/c4-components-email-worker.drawio.svg)
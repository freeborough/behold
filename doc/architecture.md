BEHOLD VTT: ARCHITECTURE
========================

## System Context

In this first phase of development we do not interact with any third-party services.

![C4 System Context Diagram](./images/c4-context.drawio.svg)

## Containers

While the WebSocket and REST APIs will be embedded together in a single process initially, I've
pulled them out separately here to clearly show that they are two distinct elements and that we will
likely break them out as such in the future for scaling.

![C4 Container Diagram](./images/c4-containers.drawio.svg)
Add a new **implementation** for an existing functional contract. Ask (or infer from context) which type:

- **LocalDb** (`*LocalDbImpl`) — direct database/repository query
- **Client** (`*Client`) — HTTP call to another service
- **Controller** (`*Impl` as `@RestController`) — expose as HTTP endpoint; put auth/metrics on the HTTP method, delegate to `invoke`
- **Service** (`@Service`) — in-process business logic

Place the implementation in the correct package (`server.functions`, `client.functions`, or `server.<domain>`). Wire with `@Service`; add `@Qualifier` if another implementation of the same contract already exists in context.

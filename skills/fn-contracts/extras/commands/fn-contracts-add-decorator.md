Add a **decorator** for an existing functional contract. The decorator implements the same `fun interface` and delegates to another implementation. Ask (or infer) which type:

- **Caching** (`Caching*`) — check cache first, delegate on miss, upsert result
- **Routing** (`Routing*`) — choose local impl vs HTTP client based on config property
- **Validation** — validate/guard inputs before delegating
- **Metrics/Logging** — wrap with observability then delegate

Inject the delegate via constructor (`private val delegate: <Contract>`). Ensure Spring wiring uses `@Qualifier` to distinguish the decorator from the delegate. Show the composition chain after adding.

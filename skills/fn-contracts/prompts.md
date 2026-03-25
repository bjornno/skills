# fn-contracts — phrases for the developer

**Cursor does not load this file as slash commands.** Use **`/fn-contracts-*`** from `.cursor/commands/` after installing (see [SKILL.md](SKILL.md)).

Copy or adapt the table below in chat to steer the agent.

| Intent | Example prompt |
|--------|----------------|
| New contract | "Define a `fun interface` contract for [capability] in the `common` functions package; group it under `<Domain>Functions`." |
| Add database impl | "Add a `*LocalDbImpl` for `<Contract>` that queries the repository; wire with `@Service`." |
| Add HTTP client impl | "Add a `*Client` implementation for `<Contract>` that calls `[endpoint]`; handle federation routing and metrics." |
| Add caching decorator | "Add a `Caching*` decorator for `<Contract>` that checks cache first, delegates on miss, and upserts on hit." |
| Add routing decorator | "Add a `Routing*` implementation for `<Contract>` that calls locally when primary, remotely otherwise." |
| Add controller adapter | "Expose `<Contract>` as a `@RestController`; put auth/metrics on the HTTP method, delegate to `invoke`." |
| Config-switched bean | "Add a `@Bean` factory that selects between `*LocalDbImpl` and `*Client` for `<Contract>` based on a config property." |
| Extract to contract | "Extract [this service method] into a `fun interface` contract in the common module; replace callers with the contract." |
| Review for fn-contracts | "Review this code — identify services that should be functional contracts. List candidates with reasoning." |
| Refactor to fn-contracts | "Refactor [class/method] to follow the fn-contracts pattern: contract in common, implementation as adapter, update wiring." |
| Add test with lambda | "Write a unit test for `<Impl>` using a lambda fake for the contract dependency — no mocking library." |
| Composition chain | "Show me the full composition chain for `<Contract>` — from consumer to final implementation." |

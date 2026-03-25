Review the current code and identify **candidates for the fn-contracts pattern**. Look for:

- Services that could benefit from multiple implementations (db vs client vs mock)
- Business logic mixed with transport/HTTP concerns that should be separated
- Places where caching or routing decorators would compose cleanly
- Tests that rely on mocking frameworks where a lambda fake would be simpler
- Existing `fun interface` contracts that are missing from the shared module

For each candidate, explain: what the contract would look like, which implementation types make sense, and what the composition chain would be. Prioritize by impact.

---
name: fn-contracts
description: >-
  Functional contract architecture for Kotlin/Spring: define capabilities as
  fun interface + operator invoke, implement as local-db, HTTP client, caching
  decorator, routing switch, controller, or any other adapter. One contract,
  many wiring options, trivially testable. Use when writing or reviewing
  Kotlin services that follow (or should follow) this pattern.
---

# fn-contracts

## The idea in one sentence

Every capability is a **`fun interface`** with **`operator fun invoke(...)`** — a contract that says *what* happens, not *how*. Implementations are swappable adapters wired by Spring.

## Why this exists

Traditional layered services (controller → service → repository) couple transport, orchestration, and data access into a fixed call chain. When you need the same capability via HTTP *and* as an in-process call, or when you want to add caching without touching business logic, the layers fight you.

Functional contracts fix this:

- **Contract-first** — the interface exists before any implementation. Consumers code against the shape, not a concrete class.
- **Duck-typing for the JVM** — if it satisfies `invoke(OrgId, WdmId): DeviceJson?`, it *is* a `GetDeviceByOrgAndWdmId`, whether it queries a database, calls an HTTP endpoint, or reads from cache.
- **Composition over inheritance** — decorators (caching, routing, validation) implement the same interface and delegate. Stack them like middleware.
- **Trivial testing** — any `fun interface` can be replaced with a lambda in tests. No mocking frameworks needed for the contract boundary.

## Anatomy of a contract

### 1. Define the contract (shared module)

Contracts live in a **shared/common module** so both server and client code can depend on them. Group related contracts in an `object`.

```kotlin
// common/.../functions/DeviceFunctions.kt
package com.example.common.functions

object DeviceFunctions {

    fun interface GetDeviceByOrgAndWdmId {
        operator fun invoke(orgId: OrgId, wdmId: WdmId): DeviceJson?
    }

    fun interface SearchDevices {
        operator fun invoke(orgId: OrgId, searchRequest: SearchRequest): SearchResult
    }
}
```

**Rules:**
- One `fun interface` per capability. Single responsibility.
- `operator fun invoke(...)` — so callers write `getDevice(orgId, wdmId)` not `getDevice.invoke(orgId, wdmId)`.
- Use domain types in the signature, not HTTP or framework types.
- Name with a verb or verb-noun: `GetDevice`, `SearchDevices`, `CreateOwnership`, `OnReportedData`.

### 2. Implement — pick your adapter

The same contract can have many implementations. Spring wires the right one.

#### Local database

```kotlin
@Service
class GetDeviceByOrgAndWdmIdLocalDbImpl(
    @Qualifier("defaultDeviceSearchRepository") val repo: DeviceSearchRepository,
) : DeviceFunctions.GetDeviceByOrgAndWdmId {

    override fun invoke(orgId: OrgId, wdmId: WdmId): DeviceJson? =
        repo.findByOrgIdAndWdmId(orgId, wdmId)
            .map { it.asJson() }
            .orElse(null)
}
```

#### HTTP client

```kotlin
class GetDeviceByOrgAndWdmIdClient(
    clientFactory: CsdmClientFactory,
) : FederationRoutingMetricEmittingClient(/*...*/),
    DeviceFunctions.GetDeviceByOrgAndWdmId {

    override fun invoke(orgId: OrgId, wdmId: WdmId): DeviceJson =
        get("/organization/$orgId/devices/wdmId=$wdmId")
            .param("useSearchIndex", true)
            .execute(orgId, DeviceJson::class.java)
}
```

#### Caching decorator

Implements the contract, delegates to another implementation of the **same** contract, adds cache logic around it.

```kotlin
@Service
class CachingOwnershipGetDevice(
    private val cache: DeviceOwnershipsRepository,
    private val delegate: OwnershipFunctions.GetDevice,
) : OwnershipFunctions.GetDevice {

    override fun invoke(identifier: String, orgId: OrgId?): DeviceOwnership? {
        val cached = cache.get(identifier)
        if (cached != null) return cached

        return delegate(identifier, orgId)?.also {
            cache.upsert(identifier, it)
        }
    }
}
```

#### Routing (local vs remote)

Decides at runtime whether to call locally or via HTTP, based on configuration. Both paths satisfy the same contract.

```kotlin
@Service
class RoutingOwnershipCreateDevice(
    private val client: OwnershipPrimaryClientFactory,
    private val localImpl: OwnershipFunctions.CreateDevice,
    @Value("#{props.isPrimary}") val isPrimary: Boolean,
) : OwnershipFunctions.CreateDevice {

    override fun invoke(identifier: String, details: OwnershipDetails): DeviceOwnership =
        if (isPrimary) localImpl(identifier, details)
        else callRemote(identifier, details)
}
```

#### Config-switched bean factory

Wire different implementations per environment or feature flag.

```kotlin
@Bean
@Primary
fun deviceLookup(
    clientFactory: CsdmClientFactory,
    @Qualifier("localDbImpl") localDb: DeviceFunctions.GetDeviceByOrgAndWdmId,
): DeviceFunctions.GetDeviceByOrgAndWdmId {
    val mode = env.getProperty("device-lookup-mode", "client")
    return if (mode == "local") localDb
    else GetDeviceByOrgAndWdmIdClient(clientFactory)
}
```

#### Controller (HTTP adapter)

The controller *is* the contract implementation. The HTTP endpoint method delegates to `invoke`.

```kotlin
@RestController
@RequestMapping("/api/v1/device-assistant")
class QueryImpl(
    private val contextFetcher: ContextFetcher,
) : Functions.Query {

    @PostMapping("/queryContext")
    @AuthorizeWhenTemplate(/*...*/)
    @WorkloadMetrics(latencyMillisThreshold = 1000)
    fun request(@Valid @RequestBody request: DeviceAssistantRequest): DeviceContextResponse =
        invoke(request)

    override fun invoke(request: DeviceAssistantRequest): DeviceContextResponse {
        val context = contextFetcher(contextQuery { /* ... */ })
        return context.toDeviceContextResponse()
    }
}
```

#### GraphQL resolver

```kotlin
@Service
class GetDeviceSearchJsonByOrgAndHydraIdImpl(
    private val deviceController: DeviceController,
) : DeviceFunctions.GetDeviceSearchJsonByOrgAndHydraId {

    override fun invoke(orgId: OrgId, hydraDeviceId: HydraDeviceId): DeviceSearchJson =
        deviceController.getDeviceByHydraId(orgId, hydraDeviceId)
}
```

## Implementation taxonomy

| Type | Class suffix / pattern | What it does |
|---|---|---|
| **LocalDb** | `*LocalDbImpl` | Direct database query |
| **Client** | `*Client` | HTTP call to another service |
| **Caching** | `Caching*` | Decorator: cache read/write around a delegate |
| **Routing** | `Routing*` | Chooses local vs remote based on config |
| **Primary** | `Primary*` | The canonical/authoritative implementation |
| **Controller** | `*Impl` as `@RestController` | HTTP adapter exposing the contract |
| **Config-switched** | `@Bean` factory | Selects implementation at startup |
| **GraphQL** | Resolver class | GraphQL adapter |

## Composition chains

Decorators and routers compose naturally. A typical chain:

```
Consumer
  → CachingOwnershipGetDevice        (cache check)
    → RoutingOwnershipGetDevice      (local or remote?)
      → PrimaryOwnershipGetDevice    (database)
      OR
      → HTTP client to primary node
```

Each link in the chain implements `OwnershipFunctions.GetDevice`. Spring wires them via constructor injection and `@Qualifier` / `@Primary` when needed.

## Testing

The entire point is that contracts are trivially fakeable:

```kotlin
@Test
fun `returns device from cache`() {
    val fakeDelegate = OwnershipFunctions.GetDevice { id, _ ->
        fail("should not reach delegate")
    }
    val cache = InMemoryOwnershipsRepository()
    cache.upsert("abc123", someDevice)

    val sut = CachingOwnershipGetDevice(cache, fakeDelegate)

    assertThat(sut("abc123", someOrgId)).isEqualTo(someDevice)
}
```

No mocking library. The lambda *is* the fake implementation.

For integration tests, wire real implementations. For unit tests, supply lambdas. For contract tests between services, both sides implement the same `fun interface` — if the client and server both compile against it, the contract is enforced at compile time.

## When to use this pattern

**Use when:**
- A capability needs multiple implementations (db, client, cache, mock)
- You want decorator composition (caching, routing, metrics, validation)
- Cross-module contracts: the `common` module defines what, server modules define how
- You want tests without mocking frameworks

**Skip when:**
- Simple CRUD with one implementation that will never vary
- The function is purely internal to one class (just use a private method)
- The overhead of a separate interface adds no value

## Conventions

### Naming

- **Contract:** verb or verb-noun — `GetDevice`, `SearchDevices`, `CreateOwnership`, `OnReportedData`
- **Grouping object:** `<Domain>Functions` — `DeviceFunctions`, `OwnershipFunctions`
- **Implementation:** descriptive suffix — `*LocalDbImpl`, `*Client`, `Caching*`, `Routing*`

### Packages

- Contracts: `<base>.common.functions` (shared module)
- Server implementations: `<base>.server.functions` or `<base>.server.<domain>`
- Client implementations: `<base>.client.functions`

### Spring wiring

- Use `@Service` on concrete implementations
- Use `@Qualifier` when multiple implementations of the same contract exist in the same context
- Use `@Primary` for the default/preferred implementation
- Use `@Bean` factory methods for config-driven selection
- Prefer constructor injection exclusively

### Auth and metrics on controllers

When a contract is exposed as an HTTP endpoint, apply security and observability annotations on the HTTP method, not on `invoke`:

```kotlin
@PostMapping("/endpoint")
@AuthorizeWhenTemplate(FullAdminDeviceAdminOrReadOnlyAdminAuthTemplate::class)
@RBACAuthorizeWhen(permissions = [DEVICE_READ], scopes = [ADMIN], targetOrgId = [Auth.Org.ANY])
@WorkloadMetrics(latencyMillisThreshold = 5000)
fun request(@Valid @RequestBody req: Req): Res = invoke(req)

override fun invoke(req: Req): Res { /* pure business logic */ }
```

This keeps `invoke` free of transport concerns — it remains testable as a plain function call.

## Do / Don't

**Do:**
- Define contracts in the shared module before writing implementations
- Keep `invoke` focused: domain logic only, no HTTP or framework types
- Use the decorator pattern for cross-cutting concerns (cache, validation, routing)
- Test with lambdas at the contract boundary

**Don't:**
- Leak HTTP types (`HttpServletRequest`, status codes) into contract signatures
- Put business logic in the controller's HTTP method — delegate to `invoke`
- Create a contract for something with exactly one implementation and no foreseeable variation
- Mix transport annotations (`@PostMapping`) with domain logic in `invoke`

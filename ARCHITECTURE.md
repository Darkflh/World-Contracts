# Hackathon Entry Architecture

**Document your technical architecture by March 9, 2026**

---

## System Overview

**High-Level Architecture:**
```
[Text-based diagram or description of major components and how they interact]

Example:
Frontend Dapp <-> TypeScript Client <-> Sui RPC <-> Smart Contracts
                                                         |
                                                    World Registry
                                                         |
                                                Your Extension Contracts
```

---

## Smart Contract Architecture

### Pre-Existing Contracts (Infrastructure)

**Bookmarks Module** (`move-contracts/bookmarks/`)
- Current capabilities:
  - [List what it does now]
- How you'll use it:
  - [How this serves as infrastructure]

**Missile/Ammunition System** (`move-contracts/missile_launcher/`, `ammunition/`)
- Current capabilities:
  - [List what it does now]
- How you'll use it:
  - [How this serves as infrastructure]

### NEW Contracts (Build March 11-31)

**Contract 1: [Name]**
- **Purpose:** 
- **Location:** `move-contracts/[folder]/`
- **Key Structures:**
  ```move
  struct [YourStruct] has key {
      id: UID,
      // ... fields
  }
  ```
- **Public Functions:**
  - `[function_name]()` - [description]
  - `[function_name]()` - [description]
- **Dependencies:**
  - World registry
  - [Other dependencies]

**Contract 2: [Name]**
- **Purpose:** 
- **Key Structures:**
- **Public Functions:**
- **Dependencies:**

### Data Model

**Key Objects/Resources:**
```
Object: [YourMainObject]
├── id: UID
├── [field]: [type]
├── [field]: [type]
└── [field]: [type]

Object: [SecondaryObject]
├── ...
```

**Object Ownership:**
- [ ] Shared objects (mutable by multiple transactions)
- [ ] Owned objects (owned by addresses)
- [ ] Immutable objects

**Access Control:**
- Who can call which functions?
- Any admin capabilities needed?
- Integration with world ACL?

---

## Frontend/Dapp Architecture

### UI Components (NEW to build)

**Component 1: [Name]**
- **Purpose:** 
- **Location:** `dapps/src/components/[Name].tsx`
- **State needed:**
  - [State variables]
- **Queries:**
  - [What on-chain data to fetch]
- **Transactions:**
  - [What contract calls to make]

**Component 2: [Name]**
- [Similar structure]

### Data Flow

**Query Pattern:**
```
User opens UI
  → Fetch [data] from RPC
  → Query [contract] for [state]
  → Display in [component]
```

**Transaction Pattern:**
```
User clicks [action]
  → Validate inputs
  → Build transaction
  → Sign with wallet
  → Execute [contract_function]
  → Wait for confirmation
  → Refresh UI
```

### State Management

- [ ] React hooks (useState, useEffect)
- [ ] @mysten/dapp-kit queries
- [ ] Custom context providers
- [ ] Other: _______________

---

## Integration Points

### With World Contracts

**Object Registry:**
- How will you register objects?
- What IDs will you use?

**Access Control:**
- Do you need admin ACL?
- Character ownership checks?

**Network Nodes:**
- Integration needed?
- Location-based logic?

### With Your Existing Systems

**Bookmarks ↔ [New System]:**
- [Describe integration]

**Missiles ↔ [New System]:**
- [Describe integration]

---

## Deployment Architecture

### Utopia Deployment

**Package Structure:**
```
world-contracts deployed
  → Your extension contract deployed
    → Extension references world package
```

**Configuration:**
- Environment: Utopia sandbox
- Network: utopia
- RPC: [from announcement]

### Optional: Stillness Deployment

**Additional Requirements:**
- [ ] Mainnet/testnet deployment
- [ ] Real player testing
- [ ] Live integration verification

---

## Technical Challenges & Solutions

**Challenge 1: [Technical Problem]**
- **Why it's hard:** 
- **Solution approach:** 
- **Fallback plan:** 

**Challenge 2: [Technical Problem]**
- **Why it's hard:** 
- **Solution approach:** 
- **Fallback plan:** 

---

## Security Considerations

**Access Control:**
- [ ] Only character owners can [action]
- [ ] Admin functions protected
- [ ] Rate limiting (if applicable)

**Input Validation:**
- [ ] Parameter bounds checking
- [ ] Type safety
- [ ] Overflow protection

**Known Limitations:**
- [Any security trade-offs or limitations]

---

## Testing Strategy

**Contract Testing:**
- [ ] Unit tests for each function
- [ ] Integration tests for workflows
- [ ] Edge case testing

**Frontend Testing:**
- [ ] Manual UI testing
- [ ] Transaction flow testing
- [ ] Error handling verification

**Deployment Testing:**
- [ ] Localnet first
- [ ] Utopia deployment
- [ ] End-to-end flow validation

---

## Performance Considerations

**Gas Optimization:**
- [ ] Minimize storage operations
- [ ] Batch operations where possible
- [ ] Efficient data structures

**Query Optimization:**
- [ ] Cache frequently accessed data
- [ ] Pagination for large lists
- [ ] Index on-chain events

---

## Dependencies

**External Packages:**
- @mysten/sui
- @mysten/dapp-kit
- [Other npm packages]

**Sui Framework:**
- sui::object
- sui::transfer
- [Other framework modules]

**World Framework:**
- World registry
- Character system
- [Other world modules]

---

## Next Steps

After completing architecture:
- [ ] Validate all components are feasible
- [ ] Identify any missing dependencies
- [ ] Move to implementation planning
- [ ] Prepare development environment

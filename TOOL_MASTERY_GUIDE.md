# Tool Mastery Practice Guide

**Complete these exercises by March 10 to be ready for hackathon**

---

## Goal

Get hands-on practice with every tool in your stack so you can move fast during the hackathon. Do these exercises on **localnet** to avoid using testnet resources.

---

## Setup: Start Localnet

**Option 1: Docker Localnet (From world-contracts)**
```powershell
# Start local Sui network
cd C:\Users\james\sui-frontier\world-contracts
docker compose up -d

# Check it's running
docker ps
```

**Option 2: Sui CLI Localnet**
```powershell
# Start built-in Sui localnet
sui start --with-faucet
```

---

## Exercise 1: Build All Contracts (30 min)

**Goal:** Verify you can build all existing Move contracts

### World Contracts
```powershell
cd C:\Users\james\sui-frontier\world-contracts

# Build world contracts
sui move build --path contracts/world

# Build asset contracts
sui move build --path contracts/assets

# Build extension examples
sui move build --path contracts/extension_examples/gates
sui move build --path contracts/extension_examples/turret
```

### Builder-Scaffold Contracts
```powershell
cd C:\Users\james\sui-frontier\builder-scaffold

# Build each extension
sui move build --path move-contracts/bookmarks
sui move build --path move-contracts/missile_launcher
sui move build --path move-contracts/ammunition
sui move build --path move-contracts/sensor_array
sui move build --path move-contracts/smart_gate
sui move build --path move-contracts/storage_unit

# Check for any build errors
```

**Checklist:**
- [ ] All world contracts build without errors
- [ ] All builder-scaffold contracts build without errors
- [ ] You understand the build output (package ID location)

---

## Exercise 2: Deploy to Localnet (1 hour)

**Goal:** Deploy contracts and understand the deployment flow

### Setup Environment
```powershell
# Copy environment template
cd C:\Users\james\sui-frontier\world-contracts
Copy-Item env.example .env.local

# Edit .env.local
# Set: SUI_NETWORK=localnet
# Set: RUST_LOG=debug
```

### Deploy World Contracts
```powershell
# Switch to localnet
sui client switch --env localnet

# Get localnet address
sui client active-address

# Fund it from localnet faucet
sui client faucet

# Deploy world
cd C:\Users\james\sui-frontier\world-contracts
pnpm deploy-world

# Save the package ID from output
```

**What to observe:**
- Transaction digest
- Package ID (save this!)
- Gas used
- Objects created

### Deploy Extension Contract
```powershell
# Update world package ID in your extension's Move.toml
# [dependencies]
# World = { local = "../path/to/world" }

# Deploy bookmarks
sui move publish --path C:\Users\james\sui-frontier\builder-scaffold\move-contracts\bookmarks

# Save the package ID
```

**Checklist:**
- [ ] World contracts deployed successfully
- [ ] Extension contract deployed successfully  
- [ ] You saved all package IDs
- [ ] You understand the publish output

---

## Exercise 3: Run TypeScript Scripts (1 hour)

**Goal:** Execute deployment scripts and understand the workflow

### Setup test-resources.json
```powershell
# Update with localnet data
cd C:\Users\james\sui-frontier\world-contracts
# Edit test-resources.json:
# - worldPackageId: [from deployment]
# - registryId: [from deployment]
# - gameCharacterId: 2112072537
```

### Run Configuration Script
```powershell
# Configure world
pnpm configure-world

# Or run specific configure script
ts-node ts-scripts/world/configure-world.ts
```

### Create Test Resources
```powershell
# Create network nodes
ts-node ts-scripts/assets/create-network-node.ts

# Record the created object IDs
```

**Checklist:**
- [ ] Scripts run without TypeScript errors
- [ ] Objects created on-chain
- [ ] You can see results in Sui explorer (localnet)
- [ ] You understand the script flow

---

## Exercise 4: Character Creation (30 min)

**Goal:** Create a character on localnet

### Create Character
```powershell
cd C:\Users\james\sui-frontier\world-contracts

# Run character creation script
ts-node ts-scripts/character/create-character.ts

# Note the character ID from output
```

### Verify Character Exists
```powershell
# Query character object
sui client object [CHARACTER_ID]

# Check the character's data structure
```

**Checklist:**
- [ ] Character created successfully
- [ ] Character ID recorded
- [ ] Character owned by your address
- [ ] You understand character structure

---

## Exercise 5: Frontend Development (2 hours)

**Goal:** Run dapp locally and understand query/transaction patterns

### Start Dapp Locally
```powershell
cd C:\Users\james\sui-frontier\builder-scaffold\dapps

# Install if needed
pnpm install

# Start dev server
pnpm dev

# Open browser to http://localhost:5173
```

### Connect Wallet
```powershell
# Install Sui Wallet extension if needed
# Create localnet wallet
# Connect to dapp
```

### Test Bookmarks Feature
- [ ] Open bookmarks panel
- [ ] Try to create a bookmark
- [ ] Check console for queries
- [ ] Watch network requests

### Examine Code Patterns

**Query Pattern:**
```typescript
// dapps/src/hooks/useBookmarks.ts (or similar)
const { data } = useSuiClientQuery('getObject', {
  id: bookmarkId,
  options: { showContent: true }
});
```

**Transaction Pattern:**
```typescript
// Example transaction builder
const txb = new TransactionBlock();
txb.moveCall({
  target: `${PACKAGE_ID}::module::function`,
  arguments: [/* ... */]
});
await signAndExecute({ transactionBlock: txb });
```

**Checklist:**
- [ ] Dapp runs locally
- [ ] Wallet connects
- [ ] You understand query hooks
- [ ] You understand transaction flow
- [ ] You can modify UI and see changes

---

## Exercise 6: Full Deployment Workflow (1 hour)

**Goal:** Practice the automated deployment script

### Run Automated Deployment
```powershell
cd C:\Users\james\sui-frontier\builder-scaffold

# Dry run first (don't execute)
.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks

# Actual execution (localnet)
.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks -Execute
```

### Verify Deployment
```powershell
# Check all resources created
# Verify test-resources.json updated
# Test the deployed contracts
```

**Checklist:**
- [ ] Automated script runs successfully
- [ ] All contracts deployed
- [ ] Configuration complete
- [ ] test-resources.json updated

---

## Exercise 7: Debugging Practice (1 hour)

**Goal:** Learn to debug common issues

### Intentional Errors to Practice

**1. Build Error:**
```powershell
# Make a syntax error in a Move file
# Try to build
# Read the error message
# Fix it
```

**2. Transaction Error:**
```powershell
# Try to call a function with wrong arguments
# Read the transaction error
# Fix the call
```

**3. Query Error:**
```powershell
# Query a non-existent object
# Handle the error in UI
# Add proper error boundary
```

### Use Debugging Tools

**Sui Explorer (Localnet):**
- View transactions
- Inspect objects
- See transaction effects

**Browser DevTools:**
- Console for errors
- Network tab for RPC calls
- React DevTools for component state

**Checklist:**
- [ ] You can read Move compile errors
- [ ] You can debug transaction failures
- [ ] You can use Sui Explorer
- [ ] You know how to check object ownership

---

## Exercise 8: Git Workflow (30 min)

**Goal:** Practice the git workflow you'll use during hackathon

### Create Feature Branch
```powershell
cd C:\Users\james\sui-frontier\builder-scaffold

# Create practice branch
git checkout -b practice-feature

# Make a small change
echo "// Practice" >> move-contracts/bookmarks/sources/bookmarks.move

# Commit
git add .
git commit -m "Practice: Add comment"

# Push
git push personal practice-feature

# Return to main
git checkout main
git branch -D practice-feature
```

**Checklist:**
- [ ] You can create branches
- [ ] You can commit with descriptive messages
- [ ] You can push to personal remote
- [ ] You understand your git workflow

---

## Exercise 9: Documentation Practice (30 min)

**Goal:** Practice writing clear technical documentation

### Document a Contract
```powershell
# Choose an existing contract
# Write a README.md for it explaining:
# - What it does
# - How to deploy it
# - How to use it
# - Examples
```

### Create Diagram
```
# Use text-based diagram like:

Frontend (React)
    ↓ query
Sui RPC
    ↓ read
Smart Contract (Bookmarks)
    ↓ uses
World Registry
```

**Checklist:**
- [ ] You can explain code clearly
- [ ] You can create simple diagrams
- [ ] You write with the reader in mind

---

## Exercise 10: Time Management (30 min)

**Goal:** Estimate how long tasks take

### Time Yourself
- [ ] Build all contracts: _____ minutes
- [ ] Deploy to localnet: _____ minutes
- [ ] Create a simple Move function: _____ minutes
- [ ] Add a UI component: _____ minutes
- [ ] Write documentation: _____ minutes

**Use these estimates for hackathon planning!**

---

## Final Checklist: Tool Mastery

Before March 11, confirm you can:

**Move/Sui:**
- [ ] Build Move contracts without errors
- [ ] Deploy contracts to localnet
- [ ] Understand Move.toml dependencies
- [ ] Read compile errors and fix them
- [ ] Query objects with Sui CLI

**TypeScript:**
- [ ] Run ts-node scripts
- [ ] Build TransactionBlocks
- [ ] Query RPC with @mysten/sui
- [ ] Handle async/await patterns
- [ ] Debug Node.js scripts

**Frontend:**
- [ ] Run Vite dev server
- [ ] Use @mysten/dapp-kit hooks
- [ ] Build and submit transactions
- [ ] Handle loading/error states
- [ ] Debug React components

**DevOps:**
- [ ] Use pnpm commands
- [ ] Navigate PowerShell efficiently
- [ ] Use Git confidently
- [ ] Read deployment logs
- [ ] Troubleshoot environment issues

---

## Resources to Keep Handy

**Official Docs:**
- Sui Move docs: https://docs.sui.io/concepts/sui-move-concepts
- Sui TypeScript SDK: https://sdk.mystenlabs.com/typescript
- Sui Explorer: https://suiexplorer.com/

**Your Repos:**
- World contracts: C:\Users\james\sui-frontier\world-contracts
- Builder scaffold: C:\Users\james\sui-frontier\builder-scaffold

**Discord:**
- EVE Frontier Discord for Utopia announcements
- Sui Discord for technical questions

---

## Notes

- Don't rush - understanding now saves time during hackathon
- Take notes on anything confusing
- If something doesn't work, debug until you understand why
- By March 10, you should feel confident with every tool
- The goal is speed and confidence on March 11!

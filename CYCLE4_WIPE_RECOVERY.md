# EVE Frontier Cycle 4 Wipe Recovery Plan
**Wipe Date: March 11, 2026** (Ending Cycle 4, Beginning Cycle 5)  
**Character: Dark III**  
**Hackathon Preparation**

---

## Pre-Wipe Backup (Do BEFORE 3/11/26)

### 1. Document Current State
- [x] Character ID: 2112072537 (Dark III)
- [x] Datacore: https://evedataco.re/explore/characters/0xdeff29e218f0fb85c014d2d10744c5b04c2d04be
- [ ] Current Package IDs (document these now!)
  ```bash
  # Run these commands and save output:
  cat world-contracts\.env | findstr WORLD_PACKAGE_ID
  cat builder-scaffold\.env | findstr PACKAGE_ID
  ```

### 2. Verify Keys are Backed Up
- [ ] `ADMIN_PRIVATE_KEY` - saved securely
- [ ] `PLAYER_A_PRIVATE_KEY` - saved securely  
- [ ] `PLAYER_B_PRIVATE_KEY` - saved securely
- [ ] Sui wallet backup phrase/keys

### 3. Test Deployment Scripts
- [ ] Test `world-contracts` deployment locally
- [ ] Test `builder-scaffold` deployment locally
- [ ] Verify all scripts in `ts-scripts/` work

---

## Post-Wipe Recovery (DO ON 3/11/26)

### Step 1: Get New Character Info (5-10 minutes)
1. Log into EVE Frontier Cycle 5 (post-wipe)
2. Find your new character on datacore:
   ```
   https://evedataco.re/explore/characters/<your-wallet-address>
   ```
3. Note your new **Character ID** (will be different from 2112072537)

### Step 2: Update Configuration (5 minutes)
1. Update `test-resources.json` in both repos:
   ```json
   {
     "_comment": "Character: Dark III | Cycle 5 | Datacore: <new-url>",
     "character": {
       "gameCharacterId": <NEW_ID_HERE>,
       ...
     }
   }
   ```

2. Commit the changes:
   ```bash
   git -C world-contracts add test-resources.json
   git -C world-contracts commit -m "Update character ID for post-Cycle 4 wipe"
   git -C world-contracts push personal main
   
   git -C builder-scaffold add test-resources.json  
   git -C builder-scaffold commit -m "Update character ID for post-Cycle 4 wipe"
   git -C builder-scaffold push personal dev-setup
   ```

### Step 3: Deploy Everything (AUTOMATED!) (20-40 minutes)

**You already have automated scripts!** Use these:

#### Option A: Full Automated Deploy (Recommended)
```powershell
cd builder-scaffold

# Dry run first to see what will happen:
.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks

# When ready, execute the full deployment:
.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks -Execute
```

This script automatically:
1. ✓ Deploys world-contracts to testnet
2. ✓ Configures world (registry, ACL, etc.)  
3. ✓ Creates test resources
4. ✓ Copies deployments to builder-scaffold
5. ✓ Builds and publishes your extension

#### Option B: Manual Step-by-Step (If automation fails)
```powershell
# 1. Deploy world contracts
cd world-contracts
pnpm install
pnpm deploy-world testnet
pnpm configure-world testnet
pnpm create-test-resources testnet

# 2. Deploy builder extension
cd ..\builder-scaffold\move-contracts\bookmarks
sui move build
sui client publish --gas-budget 500000000

# 3. Note new package IDs from output and update .env files
```

### Step 4: Create Characters On-Chain (5-10 minutes)
```powershell
cd world-contracts\ts-scripts

# Create your character with the new ID from Step 1
node character/create-character.js
# Or: pnpm character:create

# Verify it was created successfully
```

### Step 5: Setup Assemblies (Optional, 10-15 minutes)
```powershell
# Create gates, turrets, storage units etc. if needed for hackathon
cd world-contracts\ts-scripts

# Examples:
node gate/create-gates.js
node turret/anchor.js  
node storage-unit/create-storage-unit.js
```

### Step 6: Update & Test Dapp (10 minutes)
```bash
cd builder-scaffold\dapps

# Update .env with all new package IDs
# VITE_BOOKMARKS_PACKAGE_ID=<new-value>
# VITE_EVE_WORLD_PACKAGE_ID=<new-value>

# Rebuild
pnpm build

# Test locally
pnpm dev
```

### Step 7: Verify Hackathon Submission Ready
- [ ] Can query character data
- [ ] Can interact with assemblies
- [ ] Dapp UI loads and connects
- [ ] Transactions execute successfully
- [ ] Bookmarks/extensions work

---

## Quick Reference Commands

### Get Current Wallet Address
```bash
sui client active-address
```

### Check Network
```bash
sui client active-env
```

### Re-sync After Testnet Changes
```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

---

## Hackathon Submission Prep

### Before Wipe (Before 3/11/26)
- [ ] Record demo video of current functionality
- [ ] Screenshot current assemblies/deployments
- [ ] Document what your project does

### After Wipe (3/11/26+)
- [ ] Complete full redeployment
- [ ] Test all functionality
- [ ] Record new demo on Cycle 5
- [ ] Update submission with new package IDs/addresses

---

## Estimated Total Recovery Time
- **Minimum**: 1-1.5 hours (if everything goes smoothly)
- **Safe estimate**: 2-3 hours (account for issues)
- **Buffer**: Plan for 4 hours total

---

## Emergency Contacts / Resources
- EVE Frontier Discord: [Your server link]
- Sui Documentation: https://docs.sui.io
- Datacore Explorer: https://evedataco.re
- Your repos:
  - Builder: https://github.com/Darkflh/Builder-scaffold
  - World: https://github.com/Darkflh/World-Contracts

---

## Notes
- **The Cycle 4 wipe affects on-chain state ONLY**
- **Your code is safe in git** ✓
- **Wallet keys don't change** ✓
- **Contract logic stays the same** ✓
- **Just need to redeploy and reconfigure**

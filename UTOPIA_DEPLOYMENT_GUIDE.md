# EVE Frontier Utopia Sandbox Deployment Guide
**Hackathon Server: Utopia**  
**Launch Date: March 11, 2026**  
**Character: TBD (New on Utopia)**  

---

## IMPORTANT: Utopia vs Testnet

**Utopia is a SEPARATE sandbox server for the hackathon:**
- Your testnet deployment remains intact (no wipe)
- Your testnet character (Dark III - 2112072537) still exists on testnet
- You'll have a NEW character on Utopia with a different ID
- Different RPC endpoint, separate blockchain state
- No Founder Access required for Utopia

---

## Pre-Launch Checklist (Before 3/11/26)

### 1. Registration Status
- [x] Registered in EVE Frontier launcher for Utopia access
- [x] Added `--frontier-test-servers=Utopia` to launcher
- [x] Submitted registration (verification code not needed until launch)

### 2. Code & Scripts Ready
- [x] All code committed to personal repos ✓
- [x] Automated deployment scripts tested ✓
- [x] test-resources.json configured ✓
- [ ] Document current testnet Package IDs (for reference)
  ```powershell
  # Save these for comparison/backup:
  Get-Content world-contracts\.env | Select-String PACKAGE
  Get-Content builder-scaffold\dapps\.env | Select-String PACKAGE
  ```

### 3. Prepare Utopia Configuration Files
- [ ] Create `.env.utopia` in world-contracts
- [ ] Create `.env.utopia` in builder-scaffold
- [ ] Have template ready for RPC endpoint (provided on 3/11)

### 4. Wallet & Keys Ready
- [x] Admin wallet has sufficient SUI (will need Utopia faucet)
- [x] Private keys backed up securely
- [ ] Bookmark Utopia faucet URL (will be provided)

---

## Launch Day: 3/11/26 Deployment Steps

### Step 1: Get Utopia Connection Info (5 minutes)
**Check Discord/announcements for:**
1. Utopia RPC endpoint URL
2. Utopia GraphQL endpoint (if separate)
3. Utopia faucet URL for test SUI tokens
4. Utopia datacore explorer URL (if different)

Example expected info:
```
RPC: https://fullnode.utopia.sui.io:443
OR: https://utopia-rpc.evefrontier.com
```

### Step 2: Configure Utopia Environment (5 minutes)

Create `world-contracts\.env.utopia`:
```bash
# Utopia Sandbox Configuration
SUI_NETWORK=utopia
SUI_RPC_URL=<UTOPIA_RPC_FROM_STEP_1>

# Use your existing keys
GOVERNOR_PRIVATE_KEY=<same_as_testnet>
ADMIN_ADDRESS=<same_as_testnet>
ADMIN_PRIVATE_KEY=<same_as_testnet>
PLAYER_A_PRIVATE_KEY=<same_as_testnet>
PLAYER_B_PRIVATE_KEY=<same_as_testnet>

# Tenant
TENANT=dev

# These will be populated after deployment:
WORLD_PACKAGE_ID=
BUILDER_PACKAGE_ID=
```

Create `builder-scaffold\dapps\.env.utopia`:
```bash
# Utopia Dapp Configuration
VITE_SUI_NETWORK=utopia
VITE_SUI_RPC_URL=<UTOPIA_RPC_FROM_STEP_1>

# Will be populated after deployment:
VITE_BOOKMARKS_PACKAGE_ID=
VITE_EVE_WORLD_PACKAGE_ID=
VITE_BOOKMARKS_ADMIN_CAP_ID=
VITE_BOOKMARKS_EXTENSION_CONFIG_ID=
```

### Step 3: Fund Your Wallet on Utopia (5 minutes)
```bash
# Get your wallet address
sui client active-address

# Visit Utopia faucet (URL from Step 1) and request test SUI
# OR use CLI if available:
# sui client faucet --url <UTOPIA_FAUCET_URL>
```

### Step 4: Deploy to Utopia (AUTOMATED) (20-40 minutes)

**Point scripts to Utopia environment:**
```powershell
cd builder-scaffold

# Copy Utopia config as active config
Copy-Item .env.utopia .env

# Dry run to verify configuration:
.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks

# Execute full deployment to Utopia:
.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks -Execute
```

This automatically:
1. ✓ Deploys world-contracts to Utopia
2. ✓ Configures world (registry, ACL)
3. ✓ Creates test resources
4. ✓ Builds and publishes your bookmarks extension
5. ✓ Outputs new Package IDs

**Save the Package IDs from output!**

### Step 5: Get Your Utopia Character (5-10 minutes)

1. Launch EVE Frontier with Utopia server selected
2. Create/log into your character on Utopia
3. Find your character on datacore:
   ```
   https://evedataco.re/explore/characters/<your-wallet-address>
   # Or Utopia-specific datacore if provided
   ```
4. Note your **Utopia Character ID** (different from testnet)

### Step 6: Update Character Configuration (5 minutes)

Update both `test-resources.json` files:
```json
{
  "_comment": "Character: <Name> | Utopia Hackathon | Datacore: <url>",
  "character": {
    "gameCharacterId": <UTOPIA_CHARACTER_ID>,
    "gameCharacterBId": 900000001,
    "gameCharacterCId": 900000002,
    "datacoreAddress": "<your-utopia-character-address>"
  },
  ...
}
```

Commit the changes:
```powershell
git -C world-contracts add test-resources.json
git -C world-contracts commit -m "Update character ID for Utopia hackathon"
git -C world-contracts push personal main

git -C builder-scaffold add test-resources.json
git -C builder-scaffold commit -m "Update character ID for Utopia hackathon"
git -C builder-scaffold push personal dev-setup
```

### Step 7: Create Character On-Chain (5-10 minutes)
```powershell
cd world-contracts

# Ensure using Utopia config
Copy-Item .env.utopia .env

# Create your character
cd ts-scripts
node character/create-character.js
```

### Step 8: Update & Deploy Dapp (10 minutes)
```powershell
cd builder-scaffold\dapps

# Update .env with Utopia package IDs from Step 4
# VITE_BOOKMARKS_PACKAGE_ID=<from_deployment>
# VITE_EVE_WORLD_PACKAGE_ID=<from_deployment>

# Rebuild with Utopia config
pnpm build

# Test locally
pnpm dev
```

### Step 9: Setup Optional Assemblies (10-15 minutes)
```powershell
# Only if needed for your hackathon demo
cd world-contracts\ts-scripts

node gate/create-gates.js
node turret/anchor.js
node storage-unit/create-storage-unit.js
```

### Step 10: Verify Hackathon Submission Ready
- [ ] Dapp connects to Utopia
- [ ] Can query your Utopia character
- [ ] Can interact with deployed contracts
- [ ] Transactions execute successfully on Utopia
- [ ] Record demo video on Utopia environment

---

## Troubleshooting

### "Connection refused" or "Network error"
- Verify Utopia RPC URL is correct
- Check if Utopia server is live (Discord announcements)
- Ensure `.env` points to Utopia config

### "Insufficient gas"
- Visit Utopia faucet for more test SUI
- Check wallet balance: `sui client gas`

### "Package not found"
- You're pointing to testnet package IDs in Utopia
- Update package IDs in `.env` files to Utopia deployments

### Character ID mismatch
- Remember: Utopia character ID ≠ testnet character ID
- Update `test-resources.json` with Utopia character
- Re-create character with: `node character/create-character.js`

---

## Quick Reference: Environment Switching

### Deploy to Testnet (keep existing setup)
```powershell
cd world-contracts
Copy-Item .env.testnet .env  # or use default .env
pnpm deploy-world testnet
```

### Deploy to Utopia (hackathon)
```powershell
cd world-contracts
Copy-Item .env.utopia .env
pnpm deploy-world testnet  # uses whatever .env specifies
```

---

## Estimated Timeline

**Total deployment time: 1-3 hours**
- Step 1-3: 15 min (setup & funding)
- Step 4: 20-40 min (automated deployment)
- Step 5-7: 20 min (character setup)
- Step 8-9: 20-30 min (dapp & assemblies)
- Step 10: Testing & polish

**Recommended:** Start deployment immediately when Utopia launches on 3/11 to leave buffer time for issues.

---

## Resources

- EVE Frontier Discord: [Announcements for Utopia details]
- Sui Documentation: https://docs.sui.io
- Datacore Explorer: https://evedataco.re
- Your repos:
  - Builder: https://github.com/Darkflh/Builder-scaffold
  - World: https://github.com/Darkflh/World-Contracts

---

## Notes

- **Utopia is completely separate from testnet** - your testnet deployment is safe
- **You'll have TWO characters**: one on testnet (Dark III), one on Utopia
- **Package IDs will differ** between testnet and Utopia
- **Use environment files** to switch between testnet/Utopia easily
- **Commit Utopia configs** so you can recover if needed

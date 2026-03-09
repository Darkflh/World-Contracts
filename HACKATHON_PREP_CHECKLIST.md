# Hackathon Preparation Plan (March 8-10, 2026)

**Goal**: Be 100% ready to start building on March 11 when Utopia launches

---

## Day 1: March 8 (Today) - Concept & Infrastructure

### ✓ Infrastructure Setup (Already Complete!)
- [x] Character ID configured (Dark III - 2112072537)
- [x] Git repos setup and pushed to personal GitHub
- [x] Deployment scripts ready
- [x] Utopia environment templates created
- [x] Automated deployment tested

### ☐ Finalize Your Hackathon Concept (2-3 hours)

**Decision Points:**
1. What problem does your entry solve?
   - [ ] Fleet coordination?
   - [ ] Territory control?
   - [ ] Player economy?
   - [ ] Resource management?
   - [ ] Other: _______________

2. How will you extend existing work?
   - [ ] Enhance bookmarks with [specific feature]
   - [ ] Integrate missiles with [new system]
   - [ ] Build completely new mod using both
   - [ ] Other approach: _______________

3. Target prize categories (pick 2-3):
   - [ ] Best Entry (main prize)
   - [ ] Most Utility
   - [ ] Best Technical Implementation
   - [ ] Most Creative
   - [ ] Weirdest Idea
   - [ ] Best Live Frontier Integration

**Action Items:**
- [ ] Fill out [CONCEPT_PROPOSAL.md](CONCEPT_PROPOSAL.md)
- [ ] Research similar systems in other games
- [ ] Sketch basic user flows
- [ ] Define 3-5 core features for MVP

---

## Day 2: March 9 - Architecture & Planning

### ☐ Document Your Architecture (3-4 hours)

**Smart Contract Architecture:**
- [ ] List Move contracts needed (new vs existing)
- [ ] Define data structures
- [ ] Map contract interactions
- [ ] Identify security considerations

**Frontend/Dapp Architecture:**
- [ ] Define UI components needed
- [ ] Plan state management approach
- [ ] List API/RPC calls required
- [ ] Design user workflows

**Action Items:**
- [ ] Fill out [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] Create simple diagrams (text-based OK)
- [ ] Document dependencies on existing systems
- [ ] Identify technical risks

### ☐ Create Implementation Plan (2-3 hours)

**Break Down Development:**
- [ ] Week 1 (March 11-17): Core contracts & basic functionality
- [ ] Week 2 (March 18-24): Frontend integration & testing
- [ ] Week 3 (March 25-31): Polish, deploy to Stillness, submission prep

**Action Items:**
- [ ] Fill out [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
- [ ] Create task checklist with time estimates
- [ ] Identify what can be built in parallel
- [ ] Plan testing strategy

---

## Day 3: March 10 - Tool Mastery & Final Prep

### ☐ Get Comfortable With Tools (4-5 hours)

**Move Development:**
- [ ] Review Move contracts in `move-contracts/` folder
- [ ] Practice building: `sui move build`
- [ ] Read Sui Move docs for any gaps
- [ ] Review world-contracts patterns

**TypeScript/Deployment:**
- [ ] Review scripts in `ts-scripts/` folder
- [ ] Understand deployment flow in `scripts/day-of-deploy-testnet.ps1`
- [ ] Practice running scripts on localnet
- [ ] Test character creation flow

**Frontend/Dapp:**
- [ ] Review dapp code in `dapps/src/`
- [ ] Understand query patterns
- [ ] Practice transaction signing
- [ ] Test local development: `pnpm dev`

**Action Items:**
- [ ] Build all existing contracts successfully
- [ ] Deploy to localnet and verify
- [ ] Create test character on localnet
- [ ] Submit test transaction from dapp

### ☐ Final Prep Checklist

**Documentation:**
- [ ] Concept proposal complete
- [ ] Architecture documented
- [ ] Implementation plan ready
- [ ] Pre-existing work clearly identified

**Technical:**
- [ ] All tools working (sui, pnpm, node)
- [ ] Can build and deploy to localnet
- [ ] Dapp runs locally
- [ ] Git workflow tested

**Registration:**
- [ ] Utopia launcher registration confirmed ✓
- [ ] Discord/Deepsurge account ready
- [ ] GitHub repo clean and organized
- [ ] Team registration planned (if applicable)

**Reference Materials:**
- [ ] Bookmark judging criteria
- [ ] Save Utopia announcement links
- [ ] Gather code examples/docs
- [ ] Prepare workspace/dev environment

---

## Quick Reference for March 11

When Utopia launches, you'll:
1. Get Utopia RPC endpoint from Discord
2. Update `.env.utopia` files
3. Fund wallet from Utopia faucet
4. Run: `.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks -Execute`
5. Create hackathon entry branch
6. Start building!

---

## Notes

- Don't build the actual entry yet - just plan and prepare
- Keep git commits showing this is prep work, not entry work
- Focus on being able to move fast on March 11
- Get good sleep March 10 - you'll have 3 weeks of intense building ahead!

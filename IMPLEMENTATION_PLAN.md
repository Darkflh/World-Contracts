# Hackathon Implementation Plan

**Create your 3-week buildout plan by March 9, 2026**

---

## Timeline Overview

**Hackathon Period:** March 11 - March 31, 2026 (21 days)

**Milestones:**
- **Week 1 (March 11-17):** Core smart contracts + basic functionality
- **Week 2 (March 18-24):** Frontend integration + testing
- **Week 3 (March 25-31):** Polish + deployment + submission

---

## Week 1: Foundation (March 11-17)

### Day 1: March 11 (Utopia Launch Day)
**Goal:** Infrastructure deployed, development environment ready

**Morning (4-6 hours):**
- [ ] Get Utopia RPC endpoint from Discord
- [ ] Update `.env.utopia` files with connection details
- [ ] Fund wallet from Utopia faucet
- [ ] Run automated deployment: `.\scripts\day-of-deploy-testnet.ps1 -Extension bookmarks -Execute`
- [ ] Verify world-contracts deployed successfully
- [ ] Get your Utopia character and update test-resources.json
- [ ] Create on-chain character

**Afternoon (4-6 hours):**
- [ ] Create `hackathon-entry-2026` branch
- [ ] Add `PRE_EXISTING_WORK.md` documenting infrastructure
- [ ] Initialize new contract folder: `move-contracts/[your-entry]/`
- [ ] Create basic contract structure and build successfully
- [ ] First commit: "Hackathon Entry: Project initialization"

**Evening:**
- [ ] Test deployment pipeline works
- [ ] Plan tomorrow's tasks

**Time commitment:** 8-12 hours

---

### Days 2-3: March 12-13 (Core Contracts)
**Goal:** Main smart contract logic implemented

**Tasks:**
- [ ] Implement core data structures
- [ ] Write primary contract functions
- [ ] Add basic access control
- [ ] Write unit tests for contracts
- [ ] Build and verify contracts compile

**Deliverables:**
- [ ] Contract 1: [Name] - feature complete
- [ ] Contract 2: [Name] - feature complete (if applicable)
- [ ] Test suite passing
- [ ] Deployed and tested on Utopia

**Time commitment:** 12-16 hours (6-8 per day)

---

### Days 4-5: March 14-15 (Integration)
**Goal:** Integrate with existing systems and world contracts

**Tasks:**
- [ ] Connect to bookmarks system (if applicable)
- [ ] Connect to missile system (if applicable)
- [ ] Register with world object registry
- [ ] Add character ownership checks
- [ ] Test integration flows
- [ ] Deploy updated contracts to Utopia

**Deliverables:**
- [ ] Integration working end-to-end
- [ ] Can query integrated data
- [ ] Can execute full transaction flows

**Time commitment:** 12-16 hours (6-8 per day)

---

### Weekend: March 15-16 (Buffer + Planning)
**Goal:** Catch up on Week 1 + plan Week 2

**Tasks:**
- [ ] Complete any remaining Week 1 tasks
- [ ] Review and refactor contract code
- [ ] Document contract APIs
- [ ] Plan frontend components in detail
- [ ] Sketch UI wireframes

**Deliverables:**
- [ ] Week 1 fully complete
- [ ] Frontend plan documented
- [ ] Ready to start UI development

**Time commitment:** 8-12 hours

---

## Week 2: User Interface (March 18-24)

### Days 6-8: March 18-20 (Frontend Core)
**Goal:** Basic UI working with contract queries

**Tasks:**
- [ ] Create React components structure
- [ ] Implement data fetching with @mysten/dapp-kit
- [ ] Display contract data in UI
- [ ] Handle loading and error states
- [ ] Style with existing CSS framework

**Deliverables:**
- [ ] Users can view [data] in UI
- [ ] UI connects to Utopia
- [ ] Error handling works

**Time commitment:** 12-18 hours (4-6 per day)

---

### Days 9-10: March 21-22 (Transactions)
**Goal:** Users can execute transactions from UI

**Tasks:**
- [ ] Implement transaction building
- [ ] Add wallet signing flow
- [ ] Handle transaction confirmation
- [ ] Refresh UI after transactions
- [ ] Add transaction feedback/notifications

**Deliverables:**
- [ ] Full transaction flow working
- [ ] Users can [perform main action]
- [ ] UI updates reflect on-chain state

**Time commitment:** 12-16 hours (6-8 per day)

---

### Weekend: March 22-23 (Testing + Refinement)
**Goal:** Everything working smoothly

**Tasks:**
- [ ] End-to-end testing of all features
- [ ] Fix bugs discovered in testing
- [ ] Improve error messages
- [ ] Add input validation
- [ ] Test edge cases

**Deliverables:**
- [ ] All core features work reliably
- [ ] No critical bugs
- [ ] Good user experience

**Time commitment:** 8-12 hours

---

## Week 3: Polish & Submission (March 25-31)

### Days 11-12: March 25-26 (Polish)
**Goal:** Make it production-ready

**Tasks:**
- [ ] UI polish and responsive design
- [ ] Add helpful tooltips/instructions
- [ ] Optimize gas usage
- [ ] Improve loading states
- [ ] Add demo mode or tutorial

**Deliverables:**
- [ ] Professional-looking UI
- [ ] Intuitive user experience
- [ ] Optimized performance

**Time commitment:** 10-14 hours (5-7 per day)

---

### Day 13: March 27 (Stillness Deployment - BONUS)
**Goal:** Deploy to live Stillness server

**Tasks:**
- [ ] Deploy contracts to Stillness
- [ ] Verify deployment successful
- [ ] Test with real players (if possible)
- [ ] Document Stillness deployment

**Note:** This is OPTIONAL for bonus points

**Time commitment:** 4-8 hours

---

### Days 14-15: March 28-29 (Documentation & Demo)
**Goal:** Create submission materials

**Tasks:**
- [ ] Record demo video (5-10 minutes)
- [ ] Write comprehensive README.md
- [ ] Document setup instructions
- [ ] Create screenshots/images
- [ ] Prepare GitHub repo for submission

**Deliverables:**
- [ ] README.md complete
- [ ] Demo video recorded
- [ ] Repository organized
- [ ] All code committed and pushed

**Time commitment:** 8-12 hours (4-6 per day)

---

### Days 16-17: March 30-31 (Submission)
**Goal:** Submit before deadline

**March 30 Tasks:**
- [ ] Final testing pass
- [ ] Update documentation with final details
- [ ] Verify all links work
- [ ] Prepare Deepsurge submission
- [ ] Get feedback from teammates (if applicable)

**March 31 Tasks (DEADLINE DAY):**
- [ ] Final code review
- [ ] Submit via Deepsurge (before 11:59pm UTC!)
- [ ] Include GitHub link
- [ ] Include all required materials
- [ ] Verify submission went through
- [ ] Celebrate! 🎉

**Time commitment:** 4-8 hours

---

## Task Breakdown by Type

### Smart Contract Development
**Estimated total:** 40-50 hours
- Core logic: 20-25 hours
- Integration: 10-15 hours  
- Testing: 10 hours

### Frontend Development  
**Estimated total:** 30-40 hours
- Components: 15-20 hours
- Transactions: 10-15 hours
- Polish: 5-10 hours

### Documentation & Submission
**Estimated total:** 10-15 hours
- Demo video: 4-6 hours
- README/docs: 4-6 hours
- Submission prep: 2-3 hours

### Buffer for Issues
**Estimated:** 15-20 hours
- Debugging: 10-15 hours
- Learning/research: 5 hours

**TOTAL ESTIMATED TIME: 95-125 hours over 21 days**
**Average: 4.5-6 hours per day**

---

## Daily Workflow

**Recommended schedule:**
1. Morning: Review goals, pick 2-3 tasks
2. Build: 4-6 hours of focused development
3. Test: Verify what you built works
4. Commit: Push to Git with clear messages
5. Plan: Set tomorrow's priorities

**Stay flexible:** This plan will change as you discover complexity, but having the structure helps maintain momentum.

---

## Risk Management

**If you fall behind:**
- **Week 1 delayed?** → Simplify contract features, focus on MVP
- **Week 2 delayed?** → Use simpler UI, less polish
- **Week 3 rushed?** → Skip Stillness deployment (optional), focus on submission essentials

**Critical path items (don't skip):**
- Core contract functionality
- Basic working UI
- Demo video
- Deepsurge submission

---

## Success Criteria

By March 31, you should have:
- [ ] Working contracts deployed on Utopia
- [ ] Functional UI that demonstrates your concept
- [ ] Clear documentation of what's new vs pre-existing
- [ ] Demo video showing the entry in action
- [ ] Submission completed on Deepsurge

---

## Notes

- Commit frequently with descriptive messages
- Test after every significant change
- Don't aim for perfection - aim for working
- 3 weeks goes fast - focus on core value proposition
- Ask for help on Discord when stuck

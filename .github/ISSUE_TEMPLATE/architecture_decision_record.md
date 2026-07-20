---
name: 📐 Architecture Decision Record (ADR)
about: Propose and log architectural, database, or network interface changes for SETU.
title: 'adr: '
labels: ['type: documentation', 'status: Review']
assignees: ''
---

# ADR-[Number]: [Title of Decision]

## 📝 Status
- [ ] Draft
- [ ] Under Review
- [ ] Approved
- [ ] Superceded by [ADR-XXXX](file:///path/to/adr)

## 📌 Context & Problem Statement
What architectural challenge, technical debt, or scaling constraint are we addressing? Explain why this decision is necessary.

## 🧭 Design Requirements & Goals
- [ ] Goal 1: Operational limits (e.g. latency constraints)
- [ ] Goal 2: Compliance standards (e.g. DPDP / FHIR)
- [ ] Goal 3: Performance and database scaling

## ⚖️ Considered Options
1. **Option 1**: Description, pros, cons, and estimated complexity.
2. **Option 2**: Description, pros, cons, and estimated complexity.

## 🏁 Chosen Decision
Which option did we choose, and what is the technical rationale?

### Consequences & Trade-offs
- **Pros**: What advantages does this selection provide?
- **Cons**: What liabilities, technical debt, or infrastructure costs does it introduce?

## 🛠️ Implementation Plan
- **Database Schema Migrations**: [Describe tables to alter]
- **API Signature adjustments**: [Describe endpoints to modify]
- **Deployment changes**: [Describe container adjustments]

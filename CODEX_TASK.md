# Codex Task

Review and improve the standalone `index.html` demo app while keeping the business requirements unchanged.

## Required workflow

- Purchase must use ATL Number, not invoice number.
- Product purchase lines must be exactly Premium, Regular, and Diesel.
- Each product must show liter capacity, price per liter, and product total.
- Currency must be Philippine pesos.
- Supplier due date must not appear.
- Payment must remain separate from purchase.
- Payment must be updateable anytime with an open payment date.
- Payment must allow deposit slip attachment.
- Top of app must show expanded Outstanding Balance.
- System must include Fund Health Check using:
  - Total UGT Value Converted to Cash
  - Total Balance on the Bank
  - Total Sales for Deposit
- Fund Health must compare total available funds against outstanding ATL balances.
- Status rules:
  - Healthy: total available funds cover outstanding balance plus 10% buffer.
  - Watch: total available funds cover outstanding balance but buffer is below 10%.
  - Critical: total available funds are below outstanding balance.

## Suggested checks

- Load the app locally and test the Load Sample button.
- Test a new ATL purchase with all three products.
- Test partial/staggered payments.
- Test deposit slip attachment.
- Test Fund Health values that produce Healthy, Watch, and Critical statuses.
- Keep it self-contained unless asked to split files or add a backend.

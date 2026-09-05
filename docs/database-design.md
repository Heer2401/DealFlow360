# DealFlow360 Database Design

## 1. Entity List
- **users**: Internal (Sales Rep, Manager, Finance, Admin) and external (Customer) users.
- **customers**: Represents the company/account. Contains tier and credit limit.
- **products**: Catalog of items and subscriptions.
- **price_lists** / **price_list_items**: Pricing variations (e.g., Standard vs Enterprise).
- **warehouses**: Physical locations for inventory.
- **inventory**: Tracks product stock at specific warehouses.
- **discount_approval_rules**: Configuration-driven rules for discount governance based on customer tier.
- **quotations**: The central entity representing a deal.
- **quotation_lines**: Products inside a quote.
- **quotation_approvals**: Workflow history and state for quote approval.
- **quotation_negotiations**: Thread for customer counter-offers/messages.
- **sales_orders**: Created when a quote is accepted.
- **sales_order_lines**: Line items for fulfillment.
- **fulfillment_allocations**: Maps order lines to specific warehouse stock.
- **notifications**: Alerts for users (approvals, risks).
- **audit_logs**: Tracks state changes for entities.

## 2. Important Relationships
- `customers.contact_user_id` -> `users.id`
- `inventory` links `products` and `warehouses`.
- `quotations` link to `customers` and `users` (Sales Rep).
- `quotation_lines` link to `quotations` and `products`.
- `quotation_approvals` and `quotation_negotiations` link to `quotations`.
- `sales_orders` link to `quotations`.
- `fulfillment_allocations` link `sales_order_lines` to `warehouses`.

## 3. Role Model
We use a single `role` column in the `users` table with the following allowed values:
`SALES_REP`, `SALES_MANAGER`, `FINANCE_OPS`, `CUSTOMER`, `ADMIN`.

## 4. Quotation Workflow Relationships
A `quotation` starts as `DRAFT`, goes to `PENDING_APPROVAL`, `APPROVED`, then `SENT_TO_CUSTOMER`. The customer can negotiate via `quotation_negotiations` (state `IN_NEGOTIATION`), and eventually it reaches `ACCEPTED` and `ORDER_CREATED`.

## 5. Approval Relationships
Configured via `discount_approval_rules`. Based on the quote's discount and customer tier, `quotation_approvals` records are created for required roles (e.g. `SALES_MANAGER`, then `FINANCE_OPS`).

## 6. Warehouse/Inventory Relationships
`products` have `inventory` at `warehouses`. When a `sales_order` is created, `fulfillment_allocations` allocate the `sales_order_lines` to specific `warehouses`.

## 7. Design Decisions
- **UUIDs**: Used everywhere for scale and security.
- **NUMERIC**: Strict `NUMERIC(12,2)` used for all monetary values.
- **Constraints**: Heavy reliance on PostgreSQL `CHECK` constraints to ensure data integrity at the database level.
- **JSONB**: Used in `audit_logs` for flexible state tracking without rigid schemas.

## 8. Why Direct `pg` Access?
We are intentionally avoiding an ORM (like Prisma or TypeORM) to:
1. Retain explicit control over SQL schemas and complex queries (e.g. reporting, aggregations).
2. Avoid unnecessary abstraction layers and "magic" that can slow down a 2-person hackathon team when debugging.
3. Fully leverage PostgreSQL's native features like `CHECK` constraints, which some ORMs abstract poorly.

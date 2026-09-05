-- All passwords are 'password123' bcrypt hash for development only
-- $2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O

-- USERS
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@dealflow.demo', '$2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O', 'Admin User', 'ADMIN'),
('22222222-2222-2222-2222-222222222221', 'sales1@dealflow.demo', '$2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O', 'Alice Salesrep', 'SALES_REP'),
('22222222-2222-2222-2222-222222222222', 'sales2@dealflow.demo', '$2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O', 'Bob Salesrep', 'SALES_REP'),
('33333333-3333-3333-3333-333333333333', 'manager@dealflow.demo', '$2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O', 'Charlie Manager', 'SALES_MANAGER'),
('44444444-4444-4444-4444-444444444444', 'finance@dealflow.demo', '$2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O', 'Diana Finance', 'FINANCE_OPS'),
('55555555-5555-5555-5555-555555555551', 'customer1@acme.demo', '$2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O', 'Eve Customer', 'CUSTOMER'),
('55555555-5555-5555-5555-555555555552', 'customer2@globex.demo', '$2b$10$y/6VA008bmYoNOXeP9jRY.13iIV8a0vSXYMwyYuaHToCppW2yQp5O', 'Frank Customer', 'CUSTOMER');

-- CUSTOMERS
INSERT INTO customers (id, company_name, contact_user_id, tier, credit_limit) VALUES
('66666666-6666-6666-6666-666666666661', 'Acme Corp', '55555555-5555-5555-5555-555555555551', 'STANDARD', 10000.00),
('66666666-6666-6666-6666-666666666662', 'Globex Inc', '55555555-5555-5555-5555-555555555552', 'GOLD', 50000.00),
('66666666-6666-6666-6666-666666666663', 'Initech', NULL, 'PLATINUM', 100000.00);

-- PRODUCTS
INSERT INTO products (id, sku, name, description, product_type, base_price, cost_price, billing_interval) VALUES
('77777777-7777-7777-7777-777777777771', 'HW-LAP-01', 'Pro Laptop 15"', 'High performance laptop for professionals', 'ONE_TIME', 1500.00, 1000.00, NULL),
('77777777-7777-7777-7777-777777777772', 'HW-SRV-01', 'Enterprise Server', '2U Rackmount Server', 'ONE_TIME', 4500.00, 3000.00, NULL),
('77777777-7777-7777-7777-777777777773', 'HW-MON-01', 'UltraWide Monitor', '34" UltraWide Display', 'ONE_TIME', 600.00, 400.00, NULL),
('77777777-7777-7777-7777-777777777774', 'HW-NET-01', 'Core Router', 'Enterprise grade core router', 'ONE_TIME', 2200.00, 1500.00, NULL),
('77777777-7777-7777-7777-777777777775', 'SW-BKP-M', 'Cloud Backup (Monthly)', '1TB Cloud Backup Service', 'SUBSCRIPTION', 50.00, 10.00, 'MONTHLY'),
('77777777-7777-7777-7777-777777777776', 'SW-BKP-Y', 'Cloud Backup (Annual)', '1TB Cloud Backup Service', 'SUBSCRIPTION', 500.00, 100.00, 'ANNUALLY'),
('77777777-7777-7777-7777-777777777777', 'SVC-SUP-M', 'Premium Support', '24/7 Premium Support SLA', 'SUBSCRIPTION', 200.00, 50.00, 'MONTHLY'),
('77777777-7777-7777-7777-777777777778', 'SW-ANA-Q', 'Analytics Suite', 'Business Intelligence Analytics', 'SUBSCRIPTION', 1500.00, 300.00, 'QUARTERLY');

-- WAREHOUSES
INSERT INTO warehouses (id, code, name, location) VALUES
('88888888-8888-8888-8888-888888888881', 'WH-US-EAST', 'US East Distribution', 'New York, NY'),
('88888888-8888-8888-8888-888888888882', 'WH-US-WEST', 'US West Distribution', 'Los Angeles, CA'),
('88888888-8888-8888-8888-888888888883', 'WH-EU-CENTRAL', 'EU Central Hub', 'Frankfurt, Germany');

-- INVENTORY (Only for ONE_TIME products)
INSERT INTO inventory (product_id, warehouse_id, quantity_on_hand, quantity_reserved) VALUES
('77777777-7777-7777-7777-777777777771', '88888888-8888-8888-8888-888888888881', 100, 10),
('77777777-7777-7777-7777-777777777771', '88888888-8888-8888-8888-888888888882', 50, 0),
('77777777-7777-7777-7777-777777777772', '88888888-8888-8888-8888-888888888881', 20, 5),
('77777777-7777-7777-7777-777777777773', '88888888-8888-8888-8888-888888888883', 200, 20),
('77777777-7777-7777-7777-777777777774', '88888888-8888-8888-8888-888888888881', 15, 2);

-- PRICE LISTS
INSERT INTO price_lists (id, name, currency) VALUES
('99999999-9999-9999-9999-999999999991', 'Standard Price List', 'USD'),
('99999999-9999-9999-9999-999999999992', 'Enterprise Price List', 'USD');

-- PRICE LIST ITEMS (Standard = Base Price, Enterprise = Base Price * 0.9)
INSERT INTO price_list_items (price_list_id, product_id, price) VALUES
('99999999-9999-9999-9999-999999999991', '77777777-7777-7777-7777-777777777771', 1500.00),
('99999999-9999-9999-9999-999999999991', '77777777-7777-7777-7777-777777777772', 4500.00),
('99999999-9999-9999-9999-999999999991', '77777777-7777-7777-7777-777777777775', 50.00),
('99999999-9999-9999-9999-999999999992', '77777777-7777-7777-7777-777777777771', 1350.00),
('99999999-9999-9999-9999-999999999992', '77777777-7777-7777-7777-777777777772', 4050.00),
('99999999-9999-9999-9999-999999999992', '77777777-7777-7777-7777-777777777775', 45.00);

-- DISCOUNT APPROVAL RULES
-- STANDARD Tier: > 10% requires Manager, > 20% requires Finance
INSERT INTO discount_approval_rules (customer_tier, min_discount_pct, max_discount_pct, required_approver_role, sequence_order) VALUES
('STANDARD', 10.01, 20.00, 'SALES_MANAGER', 1),
('STANDARD', 20.01, 100.00, 'FINANCE_OPS', 2);

-- GOLD Tier: > 15% requires Manager, > 25% requires Finance
INSERT INTO discount_approval_rules (customer_tier, min_discount_pct, max_discount_pct, required_approver_role, sequence_order) VALUES
('GOLD', 15.01, 25.00, 'SALES_MANAGER', 1),
('GOLD', 25.01, 100.00, 'FINANCE_OPS', 2);

-- PLATINUM Tier: > 20% requires Manager, > 35% requires Finance
INSERT INTO discount_approval_rules (customer_tier, min_discount_pct, max_discount_pct, required_approver_role, sequence_order) VALUES
('PLATINUM', 20.01, 35.00, 'SALES_MANAGER', 1),
('PLATINUM', 35.01, 100.00, 'FINANCE_OPS', 2);

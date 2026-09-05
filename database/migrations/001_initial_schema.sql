-- 1. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (
        role IN (
            'SALES_REP',
            'SALES_MANAGER',
            'FINANCE_OPS',
            'CUSTOMER',
            'ADMIN'
        )
    ),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);

-- 2. CUSTOMERS
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(150) NOT NULL,
    contact_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tier VARCHAR(20) DEFAULT 'STANDARD' CHECK (
        tier IN (
            'STANDARD',
            'SILVER',
            'GOLD',
            'PLATINUM'
        )
    ),
    credit_limit NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_customers_tier ON customers(tier);

-- 3. PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    product_type VARCHAR(20) NOT NULL CHECK (
        product_type IN (
            'ONE_TIME',
            'SUBSCRIPTION'
        )
    ),
    base_price NUMERIC(12,2) NOT NULL CHECK (base_price >= 0),
    cost_price NUMERIC(12,2) NOT NULL CHECK (cost_price >= 0),
    billing_interval VARCHAR(20) CHECK (
        billing_interval IS NULL OR 
        billing_interval IN ('MONTHLY', 'QUARTERLY', 'ANNUALLY')
    ),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_type ON products(product_type);

-- 4. PRICE LISTS
CREATE TABLE price_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_list_id UUID REFERENCES price_lists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(price_list_id, product_id)
);

-- 5. WAREHOUSES
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    location TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. INVENTORY
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_reserved INT NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);

-- 7. DISCOUNT APPROVAL RULES
CREATE TABLE discount_approval_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_tier VARCHAR(20) NOT NULL CHECK (
        customer_tier IN (
            'STANDARD',
            'SILVER',
            'GOLD',
            'PLATINUM'
        )
    ),
    min_discount_pct NUMERIC(5,2) NOT NULL CHECK (min_discount_pct >= 0),
    max_discount_pct NUMERIC(5,2) NOT NULL CHECK (max_discount_pct <= 100 AND max_discount_pct >= min_discount_pct),
    required_approver_role VARCHAR(30) NOT NULL CHECK (
        required_approver_role IN (
            'SALES_MANAGER',
            'FINANCE_OPS'
        )
    ),
    sequence_order INT NOT NULL CHECK (sequence_order > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. QUOTATIONS
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    sales_rep_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(30) DEFAULT 'DRAFT' CHECK (
        status IN (
            'DRAFT',
            'PENDING_APPROVAL',
            'APPROVED',
            'REJECTED',
            'SENT_TO_CUSTOMER',
            'IN_NEGOTIATION',
            'ACCEPTED',
            'ORDER_CREATED'
        )
    ),
    total_one_time NUMERIC(12,2) DEFAULT 0.00,
    total_mrr NUMERIC(12,2) DEFAULT 0.00,
    overall_discount_pct NUMERIC(5,2) DEFAULT 0.00,
    overall_margin_pct NUMERIC(5,2) DEFAULT 0.00,
    deal_health_score INT DEFAULT 100 CHECK (deal_health_score BETWEEN 0 AND 100),
    deal_health_status VARCHAR(20) DEFAULT 'HEALTHY' CHECK (
        deal_health_status IN (
            'HEALTHY',
            'AT_RISK',
            'STALLED'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX idx_quotations_sales_rep_id ON quotations(sales_rep_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_health_status ON quotations(deal_health_status);

-- 9. QUOTATION LINES
CREATE TABLE quotation_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    discount_pct NUMERIC(5,2) DEFAULT 0.00,
    final_unit_price NUMERIC(12,2) NOT NULL CHECK (final_unit_price >= 0),
    margin_amount NUMERIC(12,2) NOT NULL,
    line_type VARCHAR(20) NOT NULL CHECK (
        line_type IN (
            'ONE_TIME',
            'SUBSCRIPTION'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_quotation_lines_quotation_id ON quotation_lines(quotation_id);

-- 10. QUOTATION APPROVALS
CREATE TABLE quotation_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
    approver_role VARCHAR(30) NOT NULL CHECK (
        approver_role IN (
            'SALES_MANAGER',
            'FINANCE_OPS'
        )
    ),
    assigned_approver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN (
            'PENDING',
            'APPROVED',
            'REJECTED'
        )
    ),
    rejection_reason TEXT,
    actioned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sequence_order INT NOT NULL
);
CREATE INDEX idx_quotation_approvals_quotation_id ON quotation_approvals(quotation_id);

-- 11. QUOTATION NEGOTIATIONS
CREATE TABLE quotation_negotiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    quotation_line_id UUID REFERENCES quotation_lines(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    proposed_discount_pct NUMERIC(5,2) CHECK (proposed_discount_pct >= 0 AND proposed_discount_pct <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_quotation_negotiations_quotation_id ON quotation_negotiations(quotation_id);

-- 12. SALES ORDERS
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    quotation_id UUID REFERENCES quotations(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PROCESSING' CHECK (
        status IN (
            'PROCESSING',
            'PARTIALLY_FULFILLED',
            'FULFILLED',
            'CANCELLED'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sales_orders_customer_id ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_quotation_id ON sales_orders(quotation_id);

-- 13. SALES ORDER LINES
CREATE TABLE sales_order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sales_order_lines_order_id ON sales_order_lines(sales_order_id);

-- 14. FULFILLMENT ALLOCATIONS
CREATE TABLE fulfillment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_line_id UUID REFERENCES sales_order_lines(id) ON DELETE CASCADE,
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE RESTRICT,
    allocated_quantity INT NOT NULL CHECK (allocated_quantity >= 0),
    backorder_quantity INT NOT NULL DEFAULT 0 CHECK (backorder_quantity >= 0),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (
        status IN (
            'PENDING',
            'SHIPPED',
            'BACKORDERED'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_fulfillment_allocations_line_id ON fulfillment_allocations(sales_order_line_id);

-- 15. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- 16. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

import { pool } from '../config/db';

export async function getCustomerByUserId(userId: string) {
  const result = await pool.query('SELECT id, company_name, tier, credit_limit FROM customers WHERE contact_user_id = $1', [userId]);
  return result.rows[0];
}

export async function getQuotationsByCustomerId(customerId: string) {
  const query = `
    SELECT 
      id, quote_number, status, total_one_time, total_mrr, 
      deal_health_status, created_at, updated_at 
    FROM quotations 
    WHERE customer_id = $1
    ORDER BY updated_at DESC
  `;
  const result = await pool.query(query, [customerId]);
  return result.rows;
}

export async function getQuotationByIdAndCustomerId(quotationId: string, customerId: string) {
  const query = `
    SELECT * 
    FROM quotations 
    WHERE id = $1 AND customer_id = $2
  `;
  const result = await pool.query(query, [quotationId, customerId]);
  return result.rows[0];
}

export async function getQuotationLines(quotationId: string) {
  const query = `
    SELECT 
      ql.id, ql.quantity, ql.unit_price, ql.discount_pct, ql.final_unit_price, ql.line_type,
      p.name as product_name, p.sku, p.billing_interval
    FROM quotation_lines ql
    JOIN products p ON ql.product_id = p.id
    WHERE ql.quotation_id = $1
    ORDER BY ql.created_at ASC
  `;
  const result = await pool.query(query, [quotationId]);
  return result.rows;
}

export async function updateQuotationStatus(quotationId: string, status: string) {
  const query = `
    UPDATE quotations
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [status, quotationId]);
  return result.rows[0];
}

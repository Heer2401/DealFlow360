import * as repo from '../repositories/customerQuotationRepository';

export async function getCustomerQuotations(userId: string) {
  const customer = await repo.getCustomerByUserId(userId);
  if (!customer) {
    throw new Error('User is not associated with any customer');
  }
  return await repo.getQuotationsByCustomerId(customer.id);
}

export async function getCustomerQuotationDetails(userId: string, quotationId: string) {
  const customer = await repo.getCustomerByUserId(userId);
  if (!customer) {
    throw new Error('User is not associated with any customer');
  }

  const quotation = await repo.getQuotationByIdAndCustomerId(quotationId, customer.id);
  if (!quotation) {
    throw new Error('Quotation not found or not authorized');
  }

  const lines = await repo.getQuotationLines(quotation.id);

  return {
    ...quotation,
    customer,
    lines
  };
}

export async function acceptQuotation(userId: string, quotationId: string) {
  const customer = await repo.getCustomerByUserId(userId);
  if (!customer) {
    throw new Error('User is not associated with any customer');
  }

  const quotation = await repo.getQuotationByIdAndCustomerId(quotationId, customer.id);
  if (!quotation) {
    throw new Error('Quotation not found or not authorized');
  }

  const acceptableStatuses = ['SENT_TO_CUSTOMER', 'IN_NEGOTIATION'];
  if (!acceptableStatuses.includes(quotation.status)) {
    throw new Error(`Quotation cannot be accepted from current status: ${quotation.status}`);
  }

  return await repo.updateQuotationStatus(quotationId, 'ACCEPTED');
}

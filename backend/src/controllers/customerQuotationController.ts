import { Request, Response } from 'express';
import * as service from '../services/customerQuotationService';

export const listQuotations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const quotations = await service.getCustomerQuotations(userId);
    res.json(quotations);
  } catch (error: any) {
    if (error.message.includes('not associated')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getQuotation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const quotationId = req.params.id as string;
    const quotation = await service.getCustomerQuotationDetails(userId, quotationId);
    res.json(quotation);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const acceptQuotation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const quotationId = req.params.id as string;
    const updated = await service.acceptQuotation(userId, quotationId);
    res.json(updated);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Quotation not found' });
    }
    if (error.message.includes('cannot be accepted')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

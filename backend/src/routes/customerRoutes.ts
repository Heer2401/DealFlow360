import { Router } from 'express';
import { listQuotations, getQuotation, acceptQuotation } from '../controllers/customerQuotationController';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Ensure all customer routes are authenticated and restricted to CUSTOMER role
router.use(authMiddleware);
router.use(requireRole(['CUSTOMER' as any]));

router.get('/quotations', listQuotations);
router.get('/quotations/:id', getQuotation);
router.post('/quotations/:id/accept', acceptQuotation);

export default router;

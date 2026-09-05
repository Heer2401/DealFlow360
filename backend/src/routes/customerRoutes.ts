import { Router } from 'express';
import { listQuotations, getQuotation, acceptQuotation } from '../controllers/customerQuotationController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Ensure all customer routes are authenticated and restricted to CUSTOMER role
router.use(authenticate);
router.use(requireRole(['CUSTOMER']));

router.get('/quotations', listQuotations);
router.get('/quotations/:id', getQuotation);
router.post('/quotations/:id/accept', acceptQuotation);

export default router;

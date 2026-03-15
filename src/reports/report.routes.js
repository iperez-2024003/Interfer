import { Router } from 'express';
import { generateExcelReport } from './report.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Endpoint protegido
router.get('/excel', validateJWT, generateExcelReport);

export default router;

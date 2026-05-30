import { Router } from 'express';
import { check, param } from 'express-validator';
import { registerCompany, getCompanies, updateCompany } from './company.controller.js';
import { validarCampos } from '../../middlewares/validate-fields.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// Todas las rutas están protegidas
router.use(validateJWT);

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('impactLevel', 'El nivel de impacto es obligatorio').not().isEmpty(),
    check('yearsTrajectory', 'Los años de trayectoria deben ser un número').isNumeric(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  registerCompany
);

router.get('/', getCompanies);

router.put(
  '/:id',
  [
    param('id', 'No es un ID válido de MongoDB').isMongoId(),
    validarCampos,
  ],
  updateCompany
);

export default router;

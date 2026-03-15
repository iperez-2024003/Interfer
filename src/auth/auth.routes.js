import { Router } from 'express';
import { check } from 'express-validator';
import { login } from './auth.controller.js';
import { validarCampos } from '../../middlewares/validate-fields.js';

const router = Router();

router.post(
  '/login',
  [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);

export default router;

import { verifyJWT } from '../helpers/generate-jwt.js';
import Admin from '../src/auth/admin.model.js';

export const validateJWT = async (req, res, next) => {
  try {
    let token = req.header('x-token') || req.header('authorization');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No hay token en la petición',
      });
    }

    token = token.replace(/^Bearer\s+/, '');

    const decoded = await verifyJWT(token);
    const admin = await Admin.findById(decoded.sub);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token no válido - Usuario no existe',
      });
    }

    if (!admin.status) {
      return res.status(423).json({
        success: false,
        message: 'Cuenta desactivada.',
      });
    }

    req.user = admin;
    req.userId = admin.id;

    next();
  } catch (error) {
    console.error('Error validating JWT:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};

import Admin from '../src/auth/admin.model.js';
import { verifyPassword } from '../utils/password-utils.js';
import { generateJWT } from './generate-jwt.js';

// Login simple basándonos en la estructura original pero con Mongoose Admin
export const loginUserHelper = async (email, password) => {
  try {
    const user = await Admin.findOne({ email });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await verifyPassword(user.password, password);

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.status) {
      throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
    }

    const token = await generateJWT(user.id.toString(), { role: user.role });

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      success: true,
      message: `¡Bienvenido Administrador ${user.name}!`,
      token,
      userDetails,
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
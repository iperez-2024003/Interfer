import { loginUserHelper } from '../../helpers/auth-operations.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserHelper(email, password);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in login controller:', error);

    let statusCode = 401;
    if (
      error.message.includes('desactivada')
    ) {
      statusCode = 423; // Locked
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error en el login',
      error: error.message,
    });
  }
};

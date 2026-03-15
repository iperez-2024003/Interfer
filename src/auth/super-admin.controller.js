import { User } from '../users/user.model.js';
import { Role, UserRole } from './role.model.js';
import { SUPER_ADMIN_ROLE } from '../../helpers/role-constants.js';
import { hashPassword } from '../../utils/password-utils.js';
import { generateUserId } from '../../helpers/uuid-generator.js';
import { sendWelcomeEmail } from '../../helpers/email-service.js';
import { Op } from 'sequelize';

/**
 * Crea un nuevo usuario con rol SUPER_ADMIN_ROLE
 * POST /api/v1/auth/create-super-admin
 * Body: { name, surname, username, email, password }
 */

export const createSuperAdmin = async (req, res, next) => {
  try {
    const { name, surname, username, email, password } = req.body;

    // Validar datos requeridos
    if (!name || !surname || !username || !email || !password) {
      return res.status(400).json({
        error: 'Se requieren: name, surname, username, email, password',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ Email: email }, { Username: username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'El correo o nombre de usuario ya está registrado',
      });
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await User.create({
      Id: generateUserId(),
      Name: name.trim(),
      Surname: surname.trim(),
      Username: username.trim(),
      Email: email.trim(),
      Password: hashedPassword,
      Status: true, // Activar automáticamente
    });

    // Obtener o crear el rol SUPER_ADMIN_ROLE
    const [role] = await Role.findOrCreate({
      where: { Name: SUPER_ADMIN_ROLE },
      defaults: { Name: SUPER_ADMIN_ROLE },
    });

    // Asignar el rol al usuario
    await UserRole.create({
      Id: generateUserId(),
      UserId: user.Id,
      RoleId: role.Id,
    });

    // Mandar email de bienvenida
    try {
      await sendWelcomeEmail(user.Email, user.Name);
    } catch (emailError) {
      console.warn('Error sending welcome email:', emailError.message);
    }

    res.status(201).json({
      message: 'Super Administrador creado exitosamente',
      user: {
        id: user.Id,
        name: user.Name,
        surname: user.Surname,
        username: user.Username,
        email: user.Email,
        role: SUPER_ADMIN_ROLE,
        status: user.Status,
        createdAt: user.CreatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Obtiene todos los SUPER_ADMINs
 * GET /api/v1/auth/super-admins
 */
export const getSuperAdmins = async (req, res, next) => {
  try {
    const superAdminRole = await Role.findOne({
      where: { Name: SUPER_ADMIN_ROLE },
    });

    if (!superAdminRole) {
      return res.json({ superAdmins: [] });
    }

    const userRoles = await UserRole.findAll({
      where: { RoleId: superAdminRole.Id },
      include: ['User'],
    });

    const superAdmins = userRoles.map((ur) => ({
      id: ur.User.Id,
      name: ur.User.Name,
      surname: ur.User.Surname,
      username: ur.User.Username,
      email: ur.User.Email,
      status: ur.User.Status,
      createdAt: ur.User.CreatedAt,
    }));

    res.json({
      totalSuperAdmins: superAdmins.length,
      superAdmins,
    });
  } catch (err) {
    next(err);
  }
};

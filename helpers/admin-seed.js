import Admin from '../src/auth/admin.model.js';
import { hashPassword } from '../utils/password-utils.js';

export const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ role: 'ADMIN_ROLE' });
    if (adminExists) {
      console.log('✅ Admin user already exists. Skipping seed.');
      return;
    }

    const hashedPassword = await hashPassword('Admin123!');
    const newAdmin = new Admin({
      name: 'Super Admin',
      email: 'admin@interfer.com',
      password: hashedPassword,
      role: 'ADMIN_ROLE',
    });

    await newAdmin.save();
    console.log('✅ Admin user seeded successfully. Email: admin@interfer.com, Password: Admin123!');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

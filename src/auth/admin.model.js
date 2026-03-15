import { Schema, model } from 'mongoose';

const AdminSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE'],
    default: 'ADMIN_ROLE',
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export default model('Admin', AdminSchema);

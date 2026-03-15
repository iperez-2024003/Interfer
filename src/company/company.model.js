import { Schema, model } from 'mongoose';

const CompanySchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la empresa es obligatorio'],
  },
  impactLevel: {
    type: String,
    required: [true, 'El nivel de impacto es obligatorio'],
  },
  yearsTrajectory: {
    type: Number,
    required: [true, 'Los años de trayectoria son obligatorios'],
  },
  category: {
    type: String,
    required: [true, 'La categoría empresarial es obligatoria'],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

CompanySchema.methods.toJSON = function () {
  const { __v, _id, ...company } = this.toObject();
  company.id = _id;
  return company;
};

export default model('Company', CompanySchema);

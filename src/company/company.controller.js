import { response, request } from 'express';
import Company from './company.model.js';

export const registerCompany = async (req = request, res = response) => {
  try {
    const { name, impactLevel, yearsTrajectory, category } = req.body;

    const company = new Company({
      name,
      impactLevel,
      yearsTrajectory,
      category,
    });

    await company.save();

    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hable con el administrador',
      error: error.message,
    });
  }
};

export const getCompanies = async (req = request, res = response) => {
  try {
    const { sortBy, category, yearsTrajectory } = req.query;

    const query = { status: true };

    if (category) {
      query.category = category;
    }
    if (yearsTrajectory) {
      query.yearsTrajectory = Number(yearsTrajectory);
    }

    let sortOptions = {};

    if (sortBy === 'A-Z') {
      sortOptions.name = 1;
    } else if (sortBy === 'Z-A') {
      sortOptions.name = -1;
    } else if (sortBy === 'years') {
      sortOptions.yearsTrajectory = -1; // Descending by default for years
    }

    const companies = await Company.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      total: companies.length,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hable con el administrador',
    });
  }
};

export const updateCompany = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { _id, status, ...data } = req.body;

    // Actualizar la empresa
    const company = await Company.findByIdAndUpdate(id, data, { new: true });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hable con el administrador',
    });
  }
};

import { response, request } from 'express';
import exceljs from 'exceljs';
import Company from '../company/company.model.js';

export const generateExcelReport = async (req = request, res = response) => {
  try {
    const companies = await Company.find({ status: true }).sort({ name: 1 });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Empresas Interfer');

    worksheet.columns = [
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Nivel de Impacto', key: 'impactLevel', width: 20 },
      { header: 'Años de Trayectoria', key: 'yearsTrajectory', width: 25 },
      { header: 'Categoría', key: 'category', width: 30 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = { from: 'A1', to: 'D1' };

    companies.forEach((company) => {
      worksheet.addRow({
        name: company.name,
        impactLevel: company.impactLevel,
        yearsTrajectory: company.yearsTrajectory,
        category: company.category,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Empresas_Interfer.xlsx');

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Hable con el administrador',
    });
  }
};

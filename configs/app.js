'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection as dbMongoConnection } from './dbMongo.js';

import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';

import authRoutes from '../src/auth/auth.routes.js';
import companyRoutes from '../src/company/company.routes.js';
import reportsRoutes from '../src/reports/report.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = async (app) => {
  app.use(`${BASE_PATH}/auth`, authRoutes);
  
  // Modulos que se crearán
  app.use(`${BASE_PATH}/company`, companyRoutes);
  app.use(`${BASE_PATH}/reports`, reportsRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'API Interfer',
    });
  });

  app.use(notFound);
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.set('trust proxy', 1);

  try {
    await dbMongoConnection();
    console.log('✅ MongoDB connected successfully');

    // Seed admin
    const { seedAdmin } = await import('../helpers/admin-seed.js');
    await seedAdmin();

    middlewares(app);
    await routes(app);

    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`Interfer API Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
    });
    return server;
  } catch (err) {
    console.error(`Error starting API Server: ${err.message}`);
    process.exit(1);
  }
};
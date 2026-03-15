'use strict';

import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB | Error en la conexión a la db: ${err.message}`);
            mongoose.disconnect(); 
        });
        mongoose.connection.on('connecting', () => {            
            console.log(`MongoDB | intentando conectar a mongoDB`);            
        });
        mongoose.connection.on('connected', () => {
            console.log(`MongoDB | conectado a mongoDB`);            
        });
        mongoose.connection.on('open', () => {
            const dbName = mongoose.connection.db?.databaseName || 'unknown';
            console.log(`MongoDB | conectado a la base de datos ${dbName}`);
        });
        mongoose.connection.on('reconnect', () => {
            console.log(`MongoDB | reconectando a mongoDB`);        
        });
        mongoose.connection.on('disconnected', () => {
            console.log(`MongoDB | desconectado de mongoDB`);            
        });

        const defaultUri = 'mongodb://127.0.1.1:27017/Interfer';
        const uri = process.env.URI_MONGO || defaultUri;
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });

    } catch (error) {
        console.log(`Error al conectar la db: ${error}`);
        throw error;
    }
}

const gracefulShutdown = async (signal) => {
    console.log(`MongoDB | Received ${signal}. Closing databse connection...`)
    try{
        await mongoose.connection.close();
        process.exit(0);
    }catch(error){
        console.error(`MongoDB | Error during graceful shutdown:`, error.message);
        process.exit(1);
    }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
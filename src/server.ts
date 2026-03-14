import express  from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import morgan from "morgan";
import { connectDB } from "./config/db";
import projectRoutes from './routues/projectRoutes'
import { corsConfig } from "./config/cors";


dotenv.config();

connectDB();

const app = express();

app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))

//Aqui es para leer el body de las peticiones, leer datos del formulario
app.use(express.json())

//Routes
app.use('/api/projects', projectRoutes)

export default app;
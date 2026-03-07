import express  from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db";
import projectRoutes from './routues/projectRoutes'


dotenv.config();

connectDB();

const app = express();

//Aqui es para leer el body de las peticiones
app.use(express.json())

//Routes
app.use('/api/projects', projectRoutes)

export default app;
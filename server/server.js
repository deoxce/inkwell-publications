import config from './config/config.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js'

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://127.0.0.1:5173', 
        'http://46.146.230.232:5173', 
        'http://deoxce.ru:5173', 
        'http://46.146.230.232', 
        'http://deoxce.ru'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Если требуется передача cookies
}));

app.use('/api', authRoutes);

app.listen(config.port, () => console.log('server is started on port', config.port));
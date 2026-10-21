import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import buyerRoutes from './routes/buyer.js';
import chatbotRoutes from './routes/chatbot.js';
import { connectDB, isDbConnected } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', buyerRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ReLoop 2.0 API',
    database: isDbConnected() ? 'MongoDB Connected' : 'In-Memory Resilient Store',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[ReLoop Server] Running at http://localhost:${PORT}`);
});

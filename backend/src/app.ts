import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const startServer = async () => {
  try {
    // Sync database with force option to rebuild tables
    // WARNING: This will drop existing tables. Use only in development
    await sequelize.sync({ force: true });
    console.log('Database synchronized and tables rebuilt');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

import { config } from 'dotenv'
import cors from "cors";
import express from 'express';
import authRoutes from './routes/auth';
import shippingRoutes from './routes/shipping';
import dbConnection from './configuration/database';

config()
const app = express();
const port = 3001;

dbConnection();

// middleware
app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/shipping', shippingRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

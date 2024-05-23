import { config } from 'dotenv'
import cors from "cors";
import express from 'express';
import authRoutes from './routes/auth';
import shippingRoutes from './routes/shipping';
import v2Routes from './routes/v2';
import dbConnection from './configuration/database';
import { checkCarriers } from './middlewares/checkCarriers';

config()
const app = express();
const port = 3001;

dbConnection();

// middleware
app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/shipping', shippingRoutes);
app.use('/v2', checkCarriers, v2Routes);

app.get('/', (req, res) => {
  res.send('Hello Shipping World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

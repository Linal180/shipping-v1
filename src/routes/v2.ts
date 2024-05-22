import { Router } from 'express';
import { getRates } from '../shipping/v2/index.controller';

const router = Router();

router.get('/rates', getRates);

export default router;

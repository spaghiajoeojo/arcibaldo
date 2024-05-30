import '@/config';
import { ExpressBeans } from 'express-beans';
import express, { NextFunction, Request, Response } from 'express';
import HealthCheckRouter from '@/routes/HealthCheckRouter';
import { ArciRouter } from '@/routes/ArciRouter';
import { OpenAITTSAdapterRouter } from './routes/OpenAITTSAdapterRouter';
import { PicoTTSAdapterRouter } from './routes/PicoTTSAdapterRouter';

const app = new ExpressBeans({
  routerBeans: [
    PicoTTSAdapterRouter,
    OpenAITTSAdapterRouter,
    ArciRouter,
    HealthCheckRouter,
  ],
});

app.use(express.json());
app.use(express.urlencoded({ type: ['application/x-www-form-urlencoded', 'text/html'] }));
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.setTimeout(500000, () => {
    // call back function is called when request timed out.
  });
  next();
});

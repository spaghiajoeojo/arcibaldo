import { ExpressBeans } from 'express-beans';
import express, { NextFunction, Request, Response } from 'express';
import HealthCheckRouter from '@/routes/HealthCheckRouter';
import { ArciRouter } from '@/routes/ArciRouter';

const app = new ExpressBeans({
  routerBeans: [
    ArciRouter,
    HealthCheckRouter,
  ],
});

app.use(express.json());
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.setTimeout(500000, () => {
    // call back function is called when request timed out.
  });
  next();
});

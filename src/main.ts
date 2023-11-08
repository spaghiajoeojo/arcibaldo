import { ExpressBeans } from 'express-beans';
import express from 'express';
import HealthCheckRouter from '@/routes/HealthCheckRouter';
import ExampleRouter from '@/routes/ExampleRouter';

const app = new ExpressBeans({
  routerBeans: [
    ExampleRouter,
    HealthCheckRouter,
  ],
});

app.use(express.json());

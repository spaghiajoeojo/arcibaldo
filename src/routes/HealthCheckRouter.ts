import {
  Request, Response,
} from 'express';
import { Route, RouterBean } from 'express-beans';

@RouterBean('/n')
export default class HealthCheckRouter {
  @Route('GET', '/live')
  livenessCheck(_req: Request, res: Response) {
    res.send({
      status: 'UP',
    });
  }

  @Route('GET', '/ready')
  readinessCheck(_req: Request, res: Response) {
    res.send({
      status: 'UP',
    });
  }
}

import { Request, Response } from 'express';
import { InjectBean, Route, RouterBean } from 'express-beans';
import ArcibaldoService from '@/services/ArcibaldoService';

@RouterBean('/arci')
export default class ExampleRouter {
  @InjectBean(ArcibaldoService)
    arciService!: ArcibaldoService;

  @Route('POST', '/ask')
  async hello(req: Request, res: Response) {
    console.log(req);
    res.end(await this.arciService.run(req.body.prompt));
  }
}

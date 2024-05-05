import { Request, Response } from 'express';
import {
  InjectBean, InjectLogger, Logger, Route, RouterBean,
} from 'express-beans';
import ArcibaldoService from '@/services/ArcibaldoService';
import TextToSpeechService from '@/services/TextToSpeechService';

@RouterBean('/arci')
export class ArciRouter {
  @InjectBean(ArcibaldoService)
    arciService!: ArcibaldoService;

  @InjectBean(TextToSpeechService)
    ttsService!: TextToSpeechService;

  @InjectLogger('Router')
    logger!: Logger;

  @Route('POST', '/ask')
  async ask(req: Request, res: Response) {
    this.logger.debug(req);
    res.end(JSON.stringify(await this.arciService.run(req.body.prompt)));
  }

  @Route('POST', '/ask-tts')
  async askTTS(req: Request, res: Response) {
    this.logger.debug(req);
    const { answer } = await this.arciService.run(req.body.prompt);
    const audio = await this.ttsService.tts(answer);
    res.type(audio.type);
    res.end(Buffer.from(await audio.arrayBuffer()));
  }
}

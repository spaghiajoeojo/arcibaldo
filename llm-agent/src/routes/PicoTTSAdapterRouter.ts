import { Request, Response } from 'express';
import {
  InjectBean, InjectLogger, Logger, Route, RouterBean,
} from 'express-beans';
import TextToSpeechService from '@/services/TextToSpeechService';

@RouterBean('/')
export class PicoTTSAdapterRouter {
  @InjectBean(TextToSpeechService)
    ttsService!: TextToSpeechService;

  @InjectLogger('PicoTTSAdapterRouter')
    logger!: Logger;

  @Route('GET', '/speak')
  async getTTS(req: Request, res: Response) {
    const text = decodeURIComponent(req.query.text as string);
    const audio = await this.ttsService.tts(text);
    res.type(audio.type);
    res.end(Buffer.from(await audio.arrayBuffer()));
  }
}

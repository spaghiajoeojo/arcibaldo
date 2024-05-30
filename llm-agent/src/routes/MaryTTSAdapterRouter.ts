import { Request, Response } from 'express';
import {
  InjectBean, InjectLogger, Logger, Route, RouterBean,
} from 'express-beans';
import TextToSpeechService from '@/services/TextToSpeechService';

@RouterBean('/')
export class MaryTTSAdapterRouter {
  @InjectBean(TextToSpeechService)
    ttsService!: TextToSpeechService;

  @InjectLogger('MaryTTSAdapterRouter')
    logger!: Logger;

  @Route('GET', '/process')
  async getTTS(req: Request, res: Response) {
    const audio = await this.ttsService.tts(req.query.INPUT_TEXT as string);
    res.type(audio.type);
    res.end(Buffer.from(await audio.arrayBuffer()));
  }

  @Route('POST', '/process')
  async postTTS(req: Request, res: Response) {
    this.logger.info(req.body);
    const audio = await this.ttsService.tts(req.body.INPUT_TEXT);
    res.type(audio.type);
    res.end(Buffer.from(await audio.arrayBuffer()));
  }
}

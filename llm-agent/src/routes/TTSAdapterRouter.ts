import { Request, Response } from 'express';
import {
  InjectBean, InjectLogger, Logger, Route, RouterBean,
} from 'express-beans';
import TextToSpeechService from '@/services/TextToSpeechService';

@RouterBean('/v1/audio')
export class ArciRouter {
  @InjectBean(TextToSpeechService)
    ttsService!: TextToSpeechService;

  @InjectLogger('TTSAdapter')
    logger!: Logger;

  @Route('POST', '/speech')
  async askTTS(req: Request, res: Response) {
    this.logger.debug(req);
    const audio = await this.ttsService.tts(req.body.input);
    res.type(audio.type);
    res.end(Buffer.from(await audio.arrayBuffer()));
  }
}

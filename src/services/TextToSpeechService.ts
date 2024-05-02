import {
  Bean,
  InjectLogger, Logger,
} from 'express-beans';
import { baseUrl, language, speaker } from '@/config/tts.json';

@Bean
export default class TextToSpeechService {
  @InjectLogger('TextToSpeechService')
  private logger!: Logger;

  public async tts(input: string) {
    this.logger.debug(`tts: ${input}`);
    const text = input.replaceAll(/\.(?:\s|\n|$)/g, '\n');
    const res = await fetch(`${baseUrl}?text=${encodeURI(text)}`, {
      headers: {
        'language-id': language,
        'speaker-id': speaker,
      },
    });
    return res.blob();
  }
}

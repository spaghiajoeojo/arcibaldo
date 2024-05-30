import {
  Bean,
  InjectLogger, Logger,
} from 'express-beans';

@Bean
export default class TextToSpeechService {
  @InjectLogger('TextToSpeechService')
  private logger!: Logger;

  public async tts(input: string) {
    const baseUrl = process.env.TTS_BASE_URL!;
    const language = process.env.TTS_LANGUAGE!;
    const speaker = process.env.TTS_SPEAKER!;
    this.logger.debug(`tts: ${JSON.stringify(input)}`);
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
    const text = input.replaceAll(/\.(?:\s|\n|$)/g, '\n');
    const res = await fetch(`${baseUrl}?text=${encodeURI(text)}')}`, {
      headers: {
        'language-id': language,
        'speaker-id': speaker,
        'speaker-wav': '/root/.local/share/tts/references/arcibaldo.wav',
      },
    });
    return res.blob();
  }
}

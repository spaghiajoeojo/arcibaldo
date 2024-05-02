import {
  InjectLogger, Logger,
} from 'express-beans';
import { Ollama } from 'ollama';
import { baseUrl } from '@/config/llm.json';

export default class FeatureExtractionService {
  @InjectLogger('FeatureExtractionService')
  private logger!: Logger;

  private client = new Ollama({ host: baseUrl });

  public async extractFeatures(input: string) {
    this.logger.debug(`Extracting features: ${input}`);
    const res = await this.client.embeddings({
      model: 'all-minilm',
      prompt: input,
    });
    return res.embedding;
  }
}

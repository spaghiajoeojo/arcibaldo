import {
  Bean, InjectLogger, Logger,
  Setup,
} from 'express-beans';
import { Ollama, Message, ChatResponse } from 'ollama';
import { MeteoTool } from './tools/MeteoTool';
import { Tool } from './tools/Tool';
import { WebSearchTool } from './tools/WebSearchTool';

@Bean
export default class ArcibaldoService {
  @InjectLogger('ArcibaldoService')
  private logger!: Logger;

  private client = new Ollama({ host: process.env.LLM_BASE_URL });

  private tools: Tool[] = [
    new MeteoTool(),
    new WebSearchTool(),
  ];

  @Setup
  async setup() {
    const model = process.env.LLM_MODEL!;
    this.logger.info(`Using model: ${model}`);
    const list = await this.client.list();
    const models = list.models.map(({ name }) => name);
    if (!models.includes(model)) {
      this.logger.info(`Model ${model} not found, downloading...`);
      await this.client.pull({ model });
    }
    this.logger.info('Model loaded');
  }

  private async iterate(messages: Message[], input: string): Promise<ChatResponse> {
    return this.client.chat({
      model: process.env.LLM_MODEL!,
      messages: [
        {
          role: 'system',
          content: `Sei un assistente molto amichevole e servizievole di nome Arcibaldo, per gli amici Arci.
        Le informazioni che dai  devono essere sempre accurate e verificate.
        Usa gli strumenti a tua disposizione per ottenere e verificare le informazioni.
        Se non hai strumenti a tua disposizione utili all'esaudire la richiesta dell'utente spiega il perché non puoi fornire aiuto.
        Se non sei in grado di verificare le informazioni usa costrutti che lo lascino intendere, ad esempio: "credo che" o "secondo me".
        Hai a disposizione i seguenti strumenti per portare a termine le richieste dell'utente:
        ${this.tools.map((tool) => ` - ${tool.name}: ${tool.desc}`).join('\n')}

        Per usare uno strumento rispondi con un json così formato:
        {
            tool: "<nome del tool>",
            input: <input specifico del tool>
        }

        Procedi per step:
        1. rispondi inizialmente con il ragionamento che hai seguito per ottenere la risposta alla domanda dell'utente:
          Pensiero: <inserisci qui il ragionamento>
        2. usa uno o più strumenti per ottenere una informazione necessaria per la risposta
        3. rispondi con il risultato ottenuto.
          esempio:
          Risposta finale: <inserisci qui il risultato>
        4. se non sei in grado di rispondere con precisione dai come risposta finale la motivazione

        Ogni messaggio può contenere SOLO uno step. Quindi rispondi con un pensiero, una risposta finale.
        Non rispondere con un pensiero l'ultimo messaggio è un pensiero.
        Non rispondere con una risposta finale se non sei giunto ad una conclusione.
        Se l'utente non ha effettuato alcuna richiesta rispondi direttamente con una "Risposta finale"

        Informazioni utili e verificate:
        Luogo corrente: Roma, Italia
        Ora e data corrente: ${(new Date()).toLocaleString('it-IT', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    weekday: 'long',
  })}
        `,
        },
        { role: 'user', content: 'Quanto costa una macchina usata?' },
        { role: 'assistant', content: 'Pensiero: per rispondere all\'utente devo sapere il costo attuale di una macchina usata. Posso usare lo strumento \'web-search\' per ottenere questa informazione.' },
        { role: 'assistant', content: '{"tool": "web-search", "input": "costo di una macchina usata"}' },
        { role: 'user', content: 'Risultato intermedio: il costo di una macchina usata ultimamente è in crescita e si aggira attorno ai 20000-30000 euro' },
        { role: 'assistant', content: 'Risposta finale: una macchina usata costa 20000-30000 euro' },
        ...messages,
        { role: 'user', content: input },
      ],
    });
  }

  async run(input: string): Promise<{ answer: string, reasoning: Message[] }> {
    this.logger.debug(`Running: ${input}`);
    let response = await this.iterate([], input);
    const conversation = [{ role: 'assistant', content: response.message.content }];
    this.logger.debug(response);
    let step = 0;
    while (!/Risposta finale:/.test(response.message.content) && step < 5) {
      conversation.push({ role: 'assistant', content: response.message.content });
      if (this.wantToCallTool(response.message.content)) {
        // eslint-disable-next-line no-await-in-loop
        conversation.push(await this.useTool(response.message.content));
      }
      // eslint-disable-next-line no-await-in-loop
      response = await this.iterate(conversation, input);

      this.logger.debug(conversation);
      this.logger.debug(response.message.content);
      step += 1;
    }
    const finalAnswer = response.message.content.slice(
      response.message.content.lastIndexOf('Risposta finale:')
      + 'Risposta finale:'.length,
    )
      .trim();

    return {
      answer: finalAnswer,
      reasoning: conversation,
    };
  }

  private wantToCallTool(content: string): boolean {
    return /(\{.*\})/.test(content);
  }

  private async useTool(content: string): Promise<Message> {
    const str = (content.match(/(\{.*\})/) ?? [''])[0];
    const json = JSON.parse(str);
    this.logger.debug(`Using tool: ${json.tool} with input: ${json.input}`);
    const tool = this.tools.find((t) => t.name === json.tool);
    const toolResponse = await tool?.use(json.input);
    return { role: 'user', content: `Risposta intermedia: ${toolResponse}` };
  }
}

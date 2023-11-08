import { Bean } from 'express-beans';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Calculator } from 'langchain/tools/calculator';
import { WikipediaQueryRun } from 'langchain/tools';
import { AgentExecutor, initializeAgentExecutorWithOptions } from 'langchain/agents';
import { openAIApiKey, baseURL, modelName } from '@/config/llm.json';

@Bean
export default class ArcibaldoService {
  private llm!: ChatOpenAI;

  private executor!: AgentExecutor;

  constructor() {
    this.init();
  }

  async init() {
    this.llm = new ChatOpenAI({
      temperature: 0,
      maxTokens: 100,
      onFailedAttempt: (err) => {
        console.log('='.repeat(10));
        console.log(err.message);
      },
      openAIApiKey,
      modelName,
      configuration: { baseURL },
    });
    this.executor = await initializeAgentExecutorWithOptions(
      [
        new Calculator(),
        new WikipediaQueryRun(),
      ],
      this.llm,
      {
        agentType: 'chat-conversational-react-description',
        verbose: true,
        maxIterations: 10,
      },
    );
  }

  run(input: string) {
    try {
      return this.executor.run(input);
    } catch (error) {
      return 'not available';
    }
  }
}

import { OpenAIChat } from 'langchain/llms/openai';
import {
  BasePromptTemplate,
  BasePromptTemplateInput,
  BaseStringPromptTemplate,
  StringPromptValue,
  TypedPromptInputValues,
} from 'langchain/dist/prompts/base';
import { PromptTemplate } from 'langchain/dist/prompts/prompt';
import { PartialValues } from 'langchain/dist/schema';
import { baseURL, modelName, openAIApiKey } from '@/config/llm.json';

const templateString = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
Answer the following questions as best you can. You have access to the following tools:

Google Search: A wrapper around Google Search. Useful for when you need to answer questions about current events. The input is the question to search relavant information.

Strictly use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [Google Search]
Action Input: the input to the action, should be a question.
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

For examples:
Question: How old is CEO of Microsoft wife?
Thought: First, I need to find who is the CEO of Microsoft.
Action: Google Search
Action Input: Who is the CEO of Microsoft?
Observation: Satya Nadella is the CEO of Microsoft.
Thought: Now, I should find out Satya Nadella's wife.
Action: Google Search
Action Input: Who is Satya Nadella's wife?
Observation: Satya Nadella's wife's name is Anupama Nadella.
Thought: Then, I need to check Anupama Nadella's age.
Action: Google Search
Action Input: How old is Anupama Nadella?
Observation: Anupama Nadella's age is 50.
Thought: I now know the final answer.
Final Answer: Anupama Nadella is 50 years old.

### Input:
{input}

### Response:
{agentScratchpad}`;

const template = new PromptTemplate({
  inputVariables: ['input', 'agentScratchpad'],
  template: templateString,
});

const tempIns = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
Question: {thought}
Query: {query}
Observation: {observation}

### Input:
Make a short summary of useful information from the result observation that is related to the question.

### Response:`;

const promptIns = new PromptTemplate(
  {
    inputVariables: ['thought', 'query', 'observation'],
    template: tempIns,
  },
);

export class ArcibaldoPromptTemplate {
  private llm: OpenAIChat;

  constructor() {
    this.llm = new OpenAIChat({ openAIApiKey, modelName, configuration: { baseURL } });
  }

  partial(_values: PartialValues):
    Promise<BasePromptTemplate<unknown, StringPromptValue, unknown>> {
    throw new Error('Method not implemented.');
  }

  async format(values: TypedPromptInputValues<any>): Promise<string> {
    // Get the intermediate steps (AgentAction, Observation tuples)
    // Format them in a particular way
    const intermediateSteps = values.pop('intermediateSteps');
    let thoughts = '';
    // Refine the observationself
    if (intermediateSteps.length > 0) {
      const regex = /Thought\s*\d*\s*:(.*?)\nAction\s*\d*\s*:(.*?)\nAction\s*\d*\s*Input\s*\d*\s*:[\s]*(.*)\nObservation/;
      let textMatch = intermediateSteps[-1][0].log;
      if (intermediateSteps.lenght > 1) {
        textMatch = `Thought: ${textMatch}`;
      }
      const match = textMatch.match(regex);
      const myList = intermediateSteps.slice(-1);
      const pINSTemp = await promptIns.format({
        thought: match[1], query: match[3], observation: myList[1],
      });
      myList[1] = this.llm.generate([pINSTemp]);
      const myTuple = myList;
      intermediateSteps[intermediateSteps.lenght - 1] = myTuple;
    }
    intermediateSteps.forEach(
      ({ action, observation }: { action: { log: string }, observation: string }) => {
        thoughts += action.log;
        thoughts += ` ${observation}\nThought:`;
      },
    );
    // Set the agentScratchpad variable to that value
    const agentScratchpad = thoughts;
    return template.format({
      agentScratchpad,
      input: values.input,
    });
  }

  // eslint-disable-next-line no-underscore-dangle
  _getPromptType(): string {
    return 'ArcibaldoPromptTemplate';
  }
}

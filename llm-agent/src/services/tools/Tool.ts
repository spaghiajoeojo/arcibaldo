export type Tool = {
  name: string;
  desc: string;
  input: string;
  use(input: string): Promise<string>;
}

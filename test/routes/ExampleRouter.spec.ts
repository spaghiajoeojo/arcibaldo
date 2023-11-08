import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';
import ExampleRouter from '@/routes/ExampleRouter';
import Mock = jest.Mock;

describe('ExampleRouter', () => {
  let req: Request;
  let res: Response;

  let exampleRouter: ExampleRouter;

  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>();
    exampleRouter = new ExampleRouter();
  });

  test('hello should return a message', async () => {
    // GIVEN
    const serviceMethodMock: Mock = exampleRouter.exampleService.example as Mock;
    serviceMethodMock.mockReturnValue('hello world!');

    // WHEN
    exampleRouter.hello(req, res);

    // THEN
    expect(exampleRouter.exampleService.example).toBeCalled();
    expect(res.end).toBeCalledWith('hello world!');
  });
});

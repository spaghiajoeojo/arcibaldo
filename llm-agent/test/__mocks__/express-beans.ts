import { mock } from 'jest-mock-extended';

const { ExpressBeans, types } = jest.requireActual('express-beans');
const noop = () => { /* do nothing */ };

const ExpressBeansMock = mock<typeof ExpressBeans>();
const BeanMock = jest.fn();
const InjectBeanMock = mock<(bean: never) => () => () => never>(
  (bean: never) => () => () => mock<typeof bean>());
const RouteMock = jest.fn().mockReturnValue(noop);
const RouterBeanMock = jest.fn().mockReturnValue(noop);
const InjectLoggerMock = jest.fn().mockReturnValue(noop);
const SetupMock = jest.fn().mockReturnValue(noop);

export {
  ExpressBeansMock as ExpressBeans,
  BeanMock as Bean,
  InjectBeanMock as InjectBean,
  RouteMock as Route,
  RouterBeanMock as RouterBean,
  InjectLoggerMock as InjectLogger,
  SetupMock as Setup,
  types,
};

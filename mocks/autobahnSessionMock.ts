import {Session} from "autobahn";

export const SessionMock = {
  id: 1,
  realm: '',
  isOpen: true,
  features: {},
  publisher_disclose_me: true,
  caller_disclose_me: true,
  subscriptions: [],
  registrations: [],
  _defer: jest.fn(() => ({
    promise: {
      then: jest.fn()
    }
  })),
  join: jest.fn(),
  leave: jest.fn(),
  call: jest.fn(),
  publish: jest.fn(),
  subscribe: jest.fn(),
  register: jest.fn(),
  unsubscribe: jest.fn(),
  unregister: jest.fn(),
  prefix: jest.fn(),
  resolve: jest.fn(),
  onjoin: jest.fn(),
  onleave: jest.fn(),
} as Session;
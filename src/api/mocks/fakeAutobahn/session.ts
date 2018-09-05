import {
  ICallOptions,
  IPublishOptions,
  IRegisterOptions,
  IRegistration,
  ISubscribeOptions,
  ISubscription,
  RegisterEndpoint,
  Session as ISession,
  SubscribeHandler
} from 'autobahn';
import {server} from './server';

export class Session {
  id: number;
  realm: string;
  isOpen: boolean;
  features: any;
  // tslint:disable-next-line:variable-name
  caller_disclose_me: boolean;
  // tslint:disable-next-line:variable-name
  publisher_disclose_me: boolean;
  subscriptions: ISubscription[][];
  registrations: IRegistration[];

  join(realm: string, authmethods: string[], authid: string): void {
    return;
  }

  leave(reason: string, message: string): void {
    return;
  }

  call<TResult>(
    procedure: string,
    args?: any[],
    kwargs?: any,
    options?: ICallOptions
  ): any {
    server.clientCall(procedure, args);
  }

  publish(
    topic: string,
    args?: any[],
    kwargs?: any,
    options?: IPublishOptions
  ): any {
    return;
  }

  subscribe(
    topic: string,
    handler: SubscribeHandler,
    options: ISubscribeOptions = {}
  ): any {
    const ref = this;
    const subscription: ISubscription = {
      topic,
      handler,
      options,
      session: ref as ISession,
      id: Date.now() + Math.round(Math.random() * 100000),
      active: true,
      unsubscribe: () => ref.unsubscribe(subscription)
    };
    server.subscribe(subscription);
    return subscription;
  }

  register(
    procedure: string,
    endpoint: RegisterEndpoint,
    options?: IRegisterOptions
  ): any {
    return;
  }

  unsubscribe(subscription: ISubscription): any {
    server.unsubscribe(subscription);
  }

  unregister(registration: IRegistration): any {
    return;
  }

  prefix(prefix: string, uri: string): void {
    return;
  }

  resolve(curie: string): any {
    return;
  }

  onjoin(roleFeatures: any): void {
    return;
  }

  onleave(reason: string, details: any): void {
    return;
  }
}

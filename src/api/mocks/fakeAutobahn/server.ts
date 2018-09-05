import {SubscribeHandler, Subscription} from 'autobahn';
import {generateData} from './dataGenerator';

interface Topics {
  [key: string]: SubscribeHandler[];
}

interface Realm {
  topics: Topics;
}

interface Realms {
  [key: string]: Realm;
}

export class Server {
  realms: Realms = {} as Realms;
  private rpcs: Topics = {};

  reset() {
    this.realms = {} as Realms;
    this.rpcs = {};
  }

  subscribe(subscription: Subscription) {
    const realmName = subscription.session.realm;
    this.realms[realmName] = this.realms[realmName] || {
      topics: {}
    };

    const realm = this.realms[realmName];
    const topicName = subscription.topic;
    realm.topics[topicName] = realm.topics[topicName] || [];
    realm.topics[topicName].push(subscription.handler);

    setInterval(() => {
      const data = generateData(subscription);
      if (data) {
        this.call(realmName, topicName, data);
      }
    }, 5000);
  }

  unsubscribe(subscription: Subscription) {
    const realmName = subscription.session.realm;
    if (!this.realms[realmName]) {
      return;
    }

    const realm = this.realms[realmName];
    const topicName = subscription.topic;
    if (!realm.topics[topicName]) {
      return;
    }

    const index = realm.topics[topicName].indexOf(subscription.handler);
    if (index !== -1) {
      realm.topics[topicName].splice(index, 1);
    }
  }

  clientCall(procedure: string, args: any) {
    if (this.rpcs[procedure]) {
      this.rpcs[procedure].forEach(handler => handler(args));
    }
  }

  call(realmName: string, topicName: string, data: any) {
    const realm = this.realms[realmName];
    if (realm) {
      const topic = realm.topics[topicName];
      if (topic) {
        topic.forEach(handler => handler([data]));
      }
    }
  }

  onCall(procedure: string, fn: () => void) {
    this.rpcs[procedure] = this.rpcs[procedure] || [];
    this.rpcs[procedure].push(fn);
  }
}

export const server: Server = new Server();

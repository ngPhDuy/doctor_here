declare module "stringee" {
  export class StringeeClient {
    hasConnected: any;
    connect(accessToken: string): void;
    on(event: string, callback: Function): void;
    disconnect(): void;
  }

  export class StringeeCall2 {
    constructor(
      client: StringeeClient,
      from: string,
      to: string,
      video: boolean
    );
    makeCall(callback: Function): void;
    answer(callback: Function): void;
    reject(callback: Function): void;
    hangup(callback: Function): void;
    on(event: string, callback: Function): void;
  }

  export class StringeeCall {
    constructor(
      client: StringeeClient,
      from: string,
      to: string,
      video: boolean
    );
    makeCall(callback: Function): void;
    answer(callback: Function): void;
    reject(callback: Function): void;
    hangup(callback: Function): void;
    on(event: string, callback: Function): void;
  }
}

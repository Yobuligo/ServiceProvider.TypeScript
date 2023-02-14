import { expect } from "chai";
import { ServiceDefinition } from "../src/ServiceDefinition";
import { SP } from "../src/ServiceProvider";
import { ServiceInstanceType } from "./../src/ServiceProviderTypes";

enum LoggerType {
  Logger,
  Logger2,
}

interface ILogger {
  readonly called: boolean;
  readonly type: LoggerType;
  log(message: string): void;
}

class LoggerService extends ServiceDefinition<ILogger> {}

class Logger implements ILogger {
  public readonly type: LoggerType = LoggerType.Logger;
  public message: string = "";
  private _called: boolean = false;

  public get called(): boolean {
    return this._called;
  }

  log(message: string): void {
    this.message = message;
    this._called = true;
  }
}

class Logger2 implements ILogger {
  public readonly type: LoggerType = LoggerType.Logger2;
  private _called: boolean = false;

  constructor() {
    this._called = true;
  }

  public get called(): boolean {
    return this._called;
  }

  log(message: string): void {
    throw new Error("Method not implemented.");
  }
}

interface IFactory {
  create(): void;
}

class FactoryService extends ServiceDefinition<IFactory> {}

class Factory implements IFactory {
  create(): void {
    throw new Error("Method not implemented.");
  }
}

describe("Service Provider", () => {
  describe("contains", () => {
    it("returns false if service is not available", () => {
      expect(SP.contains(LoggerService)).false;
    });

    it("returns true if service is available", () => {
      SP.register(LoggerService, Logger);
      expect(SP.contains(LoggerService)).true;
      SP.remove(LoggerService);
    });
  });

  describe("containsNot", () => {
    it("returns true if service is not available", () => {
      expect(SP.containsNot(LoggerService)).true;
    });

    it("returns false if service is available", () => {
      SP.register(LoggerService, Logger);
      expect(SP.containsNot(LoggerService)).false;
      SP.remove(LoggerService);
    });
  });

  describe("fetch", () => {
    it("returns registered service", () => {
      SP.register(LoggerService, Logger);
      const logger = SP.fetch(LoggerService);
      expect(logger).not.undefined;
      logger.log("");
      expect(logger.called).true;
      SP.remove(LoggerService);
    });

    it("returns registered single service instance with each request", () => {
      SP.register(LoggerService, Logger);
      const first = SP.fetch(LoggerService);
      const second = SP.fetch(LoggerService);
      expect(first === second).true;
      SP.remove(LoggerService);
    });

    it("returns registered multiple service by creating a new instance for each request", () => {
      SP.register(
        LoggerService,
        Logger,
        ServiceInstanceType.MULTI_INSTANTIABLE
      );
      const first = SP.fetch(LoggerService);
      const second = SP.fetch(LoggerService);
      expect(first === second).false;
      SP.remove(LoggerService);
    });

    it("returns put service", () => {
      const expectedLogger = new Logger();
      SP.put(LoggerService, expectedLogger);
      const actualLogger = SP.fetch(LoggerService);
      expect(actualLogger).not.undefined;
      expect(actualLogger === expectedLogger).true;
      SP.remove(LoggerService);
    });

    it("throws exception if service definition is unknown", () => {
      let error: unknown = undefined;
      try {
        SP.fetch(LoggerService);
      } catch (e: unknown) {
        error = e;
      }
      expect(error).not.undefined;
    });

    it("can handle different service types", () => {
      SP.register(LoggerService, Logger);
      SP.register(FactoryService, Factory);
      const logger: ILogger = SP.fetch(LoggerService);
      expect(logger).not.undefined;
      const factory: IFactory = SP.fetch(FactoryService);
      expect(factory).not.undefined;
    });
  });

  describe("fetchOrNull", () => {
    it("returns registered service", () => {
      SP.register(LoggerService, Logger);
      const logger = SP.fetchOrNull(LoggerService);
      expect(logger).not.undefined;
      logger?.log("");
      expect(logger?.called).true;
      SP.remove(LoggerService);
    });

    it("returns put service", () => {
      const expectedLogger = new Logger();
      SP.put(LoggerService, expectedLogger);
      const actualLogger = SP.fetchOrNull(LoggerService);
      expect(actualLogger).not.undefined;
      expect(actualLogger === expectedLogger).true;
      SP.remove(LoggerService);
    });

    it("returns undefined if service definition is unknown", () => {
      let error: unknown = undefined;
      try {
        SP.fetchOrNull(LoggerService);
      } catch (e: unknown) {
        error = e;
      }
      expect(error).undefined;
    });
  });

  describe("put", () => {
    it("puts service definition", () => {
      const expectedLogger = new Logger();
      SP.put(LoggerService, expectedLogger);
      const actualLogger = SP.fetch(LoggerService);
      expect(actualLogger === expectedLogger).true;
      SP.remove(LoggerService);
    });

    it("replaces existing service definition", () => {
      const first = new Logger();
      SP.put(LoggerService, first);
      const second = new Logger();
      SP.put(LoggerService, second);
      const actualLogger = SP.fetch(LoggerService);
      expect(actualLogger === first).false;
      expect(actualLogger === second).true;
      SP.remove(LoggerService);
    });

    it("adds single instantiable service", () => {
      const actual = new Logger();
      SP.put(LoggerService, actual);
      expect(SP.fetch(LoggerService) === SP.fetch(LoggerService)).true;
      SP.remove(LoggerService);
    });
  });

  describe("remove", () => {
    it("removes registered service", () => {
      SP.register(LoggerService, Logger);
      SP.remove(LoggerService);
      expect(SP.contains(LoggerService)).false;
    });

    it("removes put service", () => {
      const logger = new Logger();
      SP.put(LoggerService, logger);
      SP.remove(LoggerService);
      expect(SP.contains(LoggerService)).false;
    });

    it("throws no error when removing an unknown service", () => {
      SP.remove(LoggerService);
      SP.remove(LoggerService);
      expect(SP.contains(LoggerService)).false;
    });
  });

  describe("register", () => {
    it("registers service definition", () => {
      SP.register(LoggerService, Logger);
      const actualLogger = SP.fetch(LoggerService);
      expect(actualLogger).not.undefined;
      SP.remove(LoggerService);
    });

    it("replaces existing service definition", () => {
      SP.register(LoggerService, Logger);
      SP.register(LoggerService, Logger2);
      const logger = SP.fetch(LoggerService);
      expect(logger.type === LoggerType.Logger2).true;
      SP.remove(LoggerService);
    });
  });
});

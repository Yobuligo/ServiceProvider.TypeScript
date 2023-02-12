import { expect } from "chai";
import { Service } from "../src/Service";
import { SP } from "../src/ServiceProvider";

interface ILogger {
  log(message: string): void;
}

class LoggerService extends Service<ILogger> {}

class Logger implements ILogger {
  public message: string = "";
  log(message: string): void {
    this.message = message;
  }
}

describe("Service Provider", () => {
  it("contains false", () => {
    expect(SP.contains(LoggerService)).false;
  });

  it("contains true", () => {
    SP.register(LoggerService, Logger);
    expect(SP.contains(LoggerService)).true;
    SP.remove(LoggerService);
  });

  it("containsNot true", () => {
    expect(SP.containsNot(LoggerService)).true;
  });

  it("containsNot false", () => {
    SP.register(LoggerService, Logger);
    expect(SP.containsNot(LoggerService)).false;
    SP.remove(LoggerService);
  });

  it("remove existing", () => {
    SP.register(LoggerService, Logger);
    SP.remove(LoggerService);
    expect(SP.contains(LoggerService)).false;
  });

  it("remove not existing", () => {
    SP.remove(LoggerService);
    SP.remove(LoggerService);
    expect(SP.contains(LoggerService)).false;
  });
});

import { expect } from "chai";
import { ServiceDefinition } from "../src/ServiceDefinition";

interface ITest {
  testMe(): void;
}

class TestService extends ServiceDefinition<ITest> {}

describe("Service Definition", () => {
  it("provides prop instance with the correct type", () => {
    // the following code would lead to a syntax error if the type was wrong.
    const test: ITest = new TestService().instance;
    expect(test).not.undefined;
  });
});

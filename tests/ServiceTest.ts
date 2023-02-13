import { expect } from "chai";
import { ServiceDefinition } from "../src/ServiceDefinition";

interface ITest {
  testMe(): void;
}

class TestService extends ServiceDefinition<ITest> {}

describe("Service Class", () => {
  it("Verify service instance type is correct", () => {
    // the following code would lead to a syntax error if the type was wrong.
    const test: ITest = new TestService().instance;
    expect(test).not.undefined;
  });
});

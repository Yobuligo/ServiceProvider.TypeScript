import { expect } from "chai";
import { Service } from "../src/Service";

interface ITest {
  testMe(): void;
}

class TestService extends Service<ITest> {}

describe("Service Class", () => {
  it("Verify service instance type is correct", () => {
    // the following code would lead to a syntax error if the type was wrong.
    const test: ITest = new TestService().instance;
    expect(test).not.undefined;
  });
});

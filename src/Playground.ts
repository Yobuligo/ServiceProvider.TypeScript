import { Service } from "./Service";
import { SP } from "./ServiceProvider";
import { ServiceInstanceType } from "./ServiceProviderTypes";

interface IFactory {
  create<T>(type: new () => T): T;
}

class FactoryService extends Service<IFactory> {}

class Factory implements IFactory {
  create<T>(type: new () => T): T {
    return new type();
  }
}

class Person {
  firstname: string = "";
  lastname: string = "";
}

SP.register(FactoryService, Factory, ServiceInstanceType.MULTI_INSTANTIABLE);
const person = SP.fetch(FactoryService).create(Person);
console.log(`${person}`);

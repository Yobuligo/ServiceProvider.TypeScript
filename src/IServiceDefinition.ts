import { Service } from "./Service";
import { ServiceInstanceType } from "./ServiceProviderTypes";

export interface IServiceDefinition<T extends Service<any>, K extends keyof T> {
  abstractServiceType: new () => T;
  concreteServiceType?: new () => T[K];
  serviceInstanceType: ServiceInstanceType;
  service?: T[K];
}

import { Service } from "./Service";
import { ServiceInstanceType } from "./ServiceProviderTypes";

export interface IServiceDefinition<T extends Service<any>, K extends keyof T> {
  readonly abstractServiceType: new () => T;
  readonly concreteServiceType?: new () => T[K];
  readonly serviceInstanceType: ServiceInstanceType;
  service?: T[K];
}

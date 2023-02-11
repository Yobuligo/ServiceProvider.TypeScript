import { Service } from "./Service";
import { ServiceInstanceType } from "./ServiceProviderTypes";

export interface IServiceProvider {
  contains<T extends Service<any>>(abstractServiceType: new () => T): boolean;
  fetch<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T
  ): T[K];
  fetchOrNull<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T
  ): T[K] | undefined;
  put<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T,
    service: T[K]
  ): void;
  remove<T extends Service<any>>(abstractServiceType: new () => T): void;
  register<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T,
    concreteServiceType: new () => T[K],
    serviceInstanceType: ServiceInstanceType
  ): void;
}

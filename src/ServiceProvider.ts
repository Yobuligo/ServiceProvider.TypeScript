import { IServiceDefinition } from "./IServiceDefinition";
import { IServiceProvider } from "./IServiceProvider";
import { Service } from "./Service";
import { ServiceInstanceType } from "./ServiceProviderTypes";

class ServiceProviderDefault implements IServiceProvider {
  private serviceDefinitions: IServiceDefinition<any, any>[] = [];

  contains<T extends Service<any>>(abstractServiceType: new () => T): boolean {
    return this.findServiceDefinition(abstractServiceType) !== undefined;
  }

  containsNot<T extends Service<any>>(
    abstractServiceType: new () => T
  ): boolean {
    return !this.contains(abstractServiceType);
  }

  fetch<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T
  ): T[K] {
    return (
      (this.fetchOrNull(abstractServiceType) as T[K]) ??
      this.raiseUnknownServiceException(abstractServiceType)
    );
  }

  fetchOrNull<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T
  ): T[K] | undefined {
    const serviceDefinition = this.findServiceDefinition(abstractServiceType);
    if (serviceDefinition === undefined) {
      return;
    }

    switch (serviceDefinition.serviceInstanceType) {
      case ServiceInstanceType.SINGLE_INSTANTIABLE: {
        return this.fetchSingleInstantiableService<T, K>(serviceDefinition);
      }
      case ServiceInstanceType.MULTI_INSTANTIABLE: {
        return this.createService(serviceDefinition) as T[K];
      }
      default: {
        throw new Error(
          `Error while fetching service ${abstractServiceType.name}. ServiceInstanceType ${serviceDefinition.serviceInstanceType} is unknown.`
        );
      }
    }
  }

  put<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T,
    service: T[K]
  ): void {
    const serviceDefinition: IServiceDefinition<T, K> = {
      abstractServiceType: abstractServiceType,
      serviceInstanceType: ServiceInstanceType.SINGLE_INSTANTIABLE,
      service: service,
    };
    this.addServiceDefinition(serviceDefinition);
  }

  remove<T extends Service<any>>(abstractServiceType: new () => T): void {
    const index = this.serviceDefinitions.findIndex((serviceDefinition) => {
      return serviceDefinition.abstractServiceType === abstractServiceType;
    });

    if (index !== -1) {
      this.serviceDefinitions.splice(index, 1);
    }
  }

  register<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T,
    concreteServiceType: new () => T[K],
    serviceInstanceType?: ServiceInstanceType | undefined
  ): void {
    const resolvedServiceInstanceType =
      serviceInstanceType ?? ServiceInstanceType.SINGLE_INSTANTIABLE;
    const serviceDefinition: IServiceDefinition<T, K> = {
      abstractServiceType: abstractServiceType,
      concreteServiceType: concreteServiceType,
      serviceInstanceType: resolvedServiceInstanceType,
    };
    this.addServiceDefinition(serviceDefinition);
  }

  private findServiceDefinition<T extends Service<any>, K extends keyof T>(
    abstractServiceType: new () => T
  ): IServiceDefinition<T, K> | undefined {
    return this.serviceDefinitions.find((serviceDefinition) => {
      return serviceDefinition.abstractServiceType === abstractServiceType;
    });
  }

  private addServiceDefinition<T extends Service<any>, K extends keyof T>(
    serviceDefinition: IServiceDefinition<T, K>
  ): void {
    if (this.contains(serviceDefinition.abstractServiceType)) {
      this.remove(serviceDefinition.abstractServiceType);
    }
    this.serviceDefinitions.push(serviceDefinition);
  }

  private fetchSingleInstantiableService<
    T extends Service<any>,
    K extends keyof T
  >(serviceDefinition: IServiceDefinition<T, keyof T>): T[K] | undefined {
    if (serviceDefinition.service === undefined) {
      serviceDefinition.service = this.createService(serviceDefinition);
    }
    return serviceDefinition.service as T[K] | undefined;
  }

  private createService<T extends Service<any>, K extends keyof T>(
    serviceDefinition: IServiceDefinition<T, K>
  ): T[K] | undefined {
    if (serviceDefinition.concreteServiceType === undefined) {
      return undefined;
    }
    return new serviceDefinition.concreteServiceType();
  }

  private raiseUnknownServiceException<T extends Service<any>>(
    abstractServiceType: new () => T
  ): never {
    throw new Error(
      `Error while fetching service '${abstractServiceType.name}'. Service is unknown. Register the service or put it to the service provider.`
    );
  }
}

export const SP: IServiceProvider = new ServiceProviderDefault();

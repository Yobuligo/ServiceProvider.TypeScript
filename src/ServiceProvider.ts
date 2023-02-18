import { error } from "@yobuligo/core.typescript";
import { ifNull } from "@yobuligo/core.typescript/dist/core";
import {
  NoSuchElementException,
  NotSupportedException,
} from "@yobuligo/core.typescript/dist/Exceptions";
import { IServiceMeta } from "./IServiceMeta";
import { IServiceProvider } from "./IServiceProvider";
import { ServiceDefinition } from "./ServiceDefinition";
import { ServiceInstanceType } from "./ServiceProviderTypes";

class ServiceProviderDefault implements IServiceProvider {
  private serviceMetas: IServiceMeta<any, any>[] = [];

  contains<T extends ServiceDefinition<any>>(
    serviceDefinition: new () => T
  ): boolean {
    return this.findServiceMeta(serviceDefinition) !== undefined;
  }

  containsNot<T extends ServiceDefinition<any>>(
    serviceDefinition: new () => T
  ): boolean {
    return !this.contains(serviceDefinition);
  }

  fetch<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T
  ): T[TServiceType] {
    return (
      (this.fetchOrNull(serviceDefinition) as T[TServiceType]) ??
      error(
        new NoSuchElementException(
          `Error while fetching service '${serviceDefinition.name}'. Service is unknown. Register the service or put it to the service provider.`
        )
      )
    );
  }

  fetchOrNull<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T
  ): T[TServiceType] | undefined {
    const serviceMeta = this.findServiceMeta(serviceDefinition);
    if (serviceMeta === undefined) {
      return;
    }

    switch (serviceMeta.serviceInstanceType) {
      case ServiceInstanceType.SINGLE_INSTANTIABLE: {
        return this.fetchSingleInstantiableService<T, TServiceType>(
          serviceMeta
        );
      }
      case ServiceInstanceType.MULTI_INSTANTIABLE: {
        return this.createService(serviceMeta) as T[TServiceType];
      }
      default: {
        throw new NotSupportedException(
          `Error while fetching service ${serviceDefinition.name}. ServiceInstanceType ${serviceMeta.serviceInstanceType} is unknown.`
        );
      }
    }
  }

  put<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T,
    serviceInstance: T[TServiceType]
  ): void {
    const serviceMeta: IServiceMeta<T, TServiceType> = {
      serviceDefinition: serviceDefinition,
      serviceInstanceType: ServiceInstanceType.SINGLE_INSTANTIABLE,
      serviceInstance: serviceInstance,
    };
    this.addServiceMeta(serviceMeta);
  }

  remove<T extends ServiceDefinition<any>>(
    serviceDefinition: new () => T
  ): void {
    const serviceMetaIndex = this.serviceMetas.findIndex((serviceMeta) => {
      return serviceMeta.serviceDefinition === serviceDefinition;
    });

    if (serviceMetaIndex !== -1) {
      this.serviceMetas.splice(serviceMetaIndex, 1);
    }
  }

  register<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T,
    concreteServiceType: new () => T[TServiceType],
    serviceInstanceType?: ServiceInstanceType | undefined
  ): void {
    const resolvedServiceInstanceType =
      serviceInstanceType ?? ServiceInstanceType.SINGLE_INSTANTIABLE;
    const serviceMeta: IServiceMeta<T, TServiceType> = {
      serviceDefinition: serviceDefinition,
      concreteServiceType: concreteServiceType,
      serviceInstanceType: resolvedServiceInstanceType,
    };
    this.addServiceMeta(serviceMeta);
  }

  private findServiceMeta<
    T extends ServiceDefinition<any>,
    TServiceType extends keyof T
  >(serviceDefinition: new () => T): IServiceMeta<T, TServiceType> | undefined {
    return this.serviceMetas.find((serviceMeta) => {
      return serviceMeta.serviceDefinition === serviceDefinition;
    });
  }

  private addServiceMeta<
    T extends ServiceDefinition<any>,
    TServiceType extends keyof T
  >(serviceMeta: IServiceMeta<T, TServiceType>): void {
    if (this.contains(serviceMeta.serviceDefinition)) {
      this.remove(serviceMeta.serviceDefinition);
    }
    this.serviceMetas.push(serviceMeta);
  }

  private fetchSingleInstantiableService<
    T extends ServiceDefinition<any>,
    TServiceType extends keyof T
  >(serviceMeta: IServiceMeta<T, keyof T>): T[TServiceType] | undefined {
    ifNull(serviceMeta.serviceInstance, () => {
      serviceMeta.serviceInstance = this.createService(serviceMeta);
    });
    return serviceMeta.serviceInstance as T[TServiceType] | undefined;
  }

  private createService<
    T extends ServiceDefinition<any>,
    TServiceType extends keyof T
  >(serviceMeta: IServiceMeta<T, TServiceType>): T[TServiceType] | undefined {
    if (serviceMeta.concreteServiceType === undefined) {
      return undefined;
    }
    return new serviceMeta.concreteServiceType();
  }
}

export const SP: IServiceProvider = new ServiceProviderDefault();

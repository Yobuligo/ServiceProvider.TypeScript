import { ServiceDefinition } from "./ServiceDefinition";
import { ServiceInstanceType } from "./ServiceProviderTypes";

/**
 * An implementation of this interface represents a service provider.
 * It is responsible for providing services which were added or registered before.
 *
 * The provided services are normally of an abstract type, but only the added or registered services are concrete.
 * So the requested services must only be of an abstract type which can be easily exchanged.
 */
export interface IServiceProvider {
  /**
   * Returns if the given service of the {@link serviceDefinition} is known by the service provider.
   */
  contains<T extends ServiceDefinition<any>>(
    serviceDefinition: new () => T
  ): boolean;

  /**
   * Returns if the given service of the {@link serviceDefinition} is unknown by the service provider.
   */
  containsNot<T extends ServiceDefinition<any>>(
    serviceDefinition: new () => T
  ): boolean;

  /**
   * Returns the service of the {@link serviceDefinition} or throws an exception if the service type is unknown.
   */
  fetch<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T
  ): T[TServiceType];

  /**
   * Returns the service of the {@link serviceDefinition} or {@link undefined} if the service type is unknown.
   */
  fetchOrNull<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T
  ): T[TServiceType] | undefined;

  /**
   * Sets a {@link serviceInstance} for the {@link serviceDefinition}. The {@link serviceInstance} must be of type of the service type which is defined in the {@link serviceDefinition}.
   *
   * If a service of this service type is already defined, it is replaced.
   */
  put<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T,
    serviceInstance: T[TServiceType]
  ): void;

  /**
   * Removes the {@link serviceDefinition} which means the services cannot be fetched anymore.
   */
  remove<T extends ServiceDefinition<any>>(
    serviceDefinition: new () => T
  ): void;

  /**
   * Registers a service type by providing the {@link serviceDefinition}, the concrete service class type and optionally the {@link serviceInstanceType}.
   * If the {@link serviceInstanceType} is not provided it is set to {@link ServiceInstanceType.SINGLE_INSTANTIABLE} as default.
   */
  register<T extends ServiceDefinition<any>, TServiceType extends keyof T>(
    serviceDefinition: new () => T,
    concreteServiceType: new () => T[TServiceType],
    serviceInstanceType?: ServiceInstanceType
  ): void;
}

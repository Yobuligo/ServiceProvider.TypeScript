import { ServiceDefinition } from "./ServiceDefinition";
import { ServiceInstanceType } from "./ServiceProviderTypes";

/**
 * An implementation of this interface contains all information about a service.
 */
export interface IServiceMeta<
  T extends ServiceDefinition<any>,
  TServiceType extends keyof T
> {
  /**
   * This property contains the {@link ServiceDefinition} type which refers to the connected service type. Each service definition must extend {@link ServiceDefinition}.
   */
  readonly serviceDefinition: new () => T;

  /**
   * This property contains the class of the service type. It is optional and only used if the service should be created on demand by registering the service.
   */
  readonly concreteServiceType?: new () => T[TServiceType];

  /**
   * This property contains the instantiation type of the service. If the service is initialized only once {@link ServiceInstanceType.SINGLE_INSTANTIABLE} and the single created service instance is returned with each request.
   * Or multiple {@link ServiceInstanceType.MULTI_INSTANTIABLE} which means that with each request of the same service a new instance is created.
   */
  readonly serviceInstanceType: ServiceInstanceType;

  /**
   * This property contains the created service instance for {@link ServiceInstanceType.SINGLE_INSTANTIABLE}.
   */
  serviceInstance?: T[TServiceType];
}

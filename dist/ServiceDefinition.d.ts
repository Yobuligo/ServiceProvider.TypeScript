/**
 * This class represents a {@link ServiceDefinition}. It connects a {@link TServiceType} with a concrete class. It is the key which refers to that {@link TServiceType}.
 */
export declare abstract class ServiceDefinition<TServiceType> {
    readonly instance: TServiceType;
}

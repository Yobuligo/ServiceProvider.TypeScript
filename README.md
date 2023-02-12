# ServiceProvider.TypeScript
An implementation of the service provider / service locator pattern for TypeScript. 
To get more independent from concrete classes required entities, services, etc. are provided via interface type.
The service provider is responsible for providing theses requested services.

## Installation
TBD

## Usage
The following chapter describes how to use the service provider.

### Implement service
As in TypeScript interface types are only available during design time but not at runtime, it is not possible to request a service only by interface type as it won't be possible to analyze the interface type.
Instead it is necessary to provide a concrete type which exists at runtime which is connected to the concrete service type.
So, implementing a service requires the following steps:

1. Provide service type
```
interface ILogger {
  log(message: string): void;
}
```

2. Provide service class which refers to the service type. This class must extend `Service`.
```
class LoggerService extends Service<ILogger> {}
```

3. Provide a variant of the service itself, which implements the service type.
```
class Logger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}
```

### Provide a service to the service provider
To request a service from the service provider, at first it has to be provided to the service provider.
Providing an already existing service type overrides the existing service definition by the new one.
There are two ways to provide a service to the service provider:

1. Put service
By putting a service, an already initialized service will be set to the service provider. The service class (here 'LoggerService') is required as first parameter. The class type is the key for addressing that concrete service. As the service type is connected to that class, an instance of that service type has to be injected as second parameter.
To put a service means it is handled as a singleton service. Each time that service is requested, the same instance is returned.
```
const logger: ILogger = new Logger();
SP.put(LoggerService, logger);
```

2. Register service
An alternative to putting a service is to register a service. Here the service is only initialized on demand.
The registration of a service needs 3 parameter. The service class as key, which is connected to the service type. The concrete service implementation class, which should be initialized when the service is requested and the service instantiation type. The service instantiation type must be either multiple or single instantiable.
It defines if either always the same service instance is returned or that with each service request a new instance of the service is returned.
```
SP.register(LoggerService, Logger, ServiceInstanceType.MULTI_INSTANTIABLE);
```

### Request a service
Requesting a service means that by providing the service class a service instance of the service type is returned. The concrete implementation class of the service type is unknown, which makes it easy to exchange a service.
There are two ways to request a service:

1. fetch
To fetch a service the service class has to be provided as key and returns the service. If the service doesn't exist an exception is raised.
```
const logger = SP.fetch(LoggerService);
logger.log(`Message to be logged`);
```

2. fetchOrNull
FetchOrNull is equivalent to fetch a service. But in case that the requested service doesn't exist, undefined is returned instead of raising an exception.
By operator `?.` the method `log` is only called in case the instance `logger` is not undefined.
```
const logger = SP.fetchOrNull(LoggerService);
logger?.log(`Message to be logged`);
```

### Remove a service
To a remove a service from the service provider method `remove` is used. As parameter the service class has to be provided as key.
```
SP.remove(LoggerService);
```

### Does a service exist
For a more readable code the method `contains` returns if a service is defined in the service provide, without the need to initialize it in case it is only registered.
```
const contains = SP.contains(LoggerService);
```

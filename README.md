# ServiceProvider.TypeScript
An implementation of dependency injection for TypeScript by using a service provider / service locator.

## Installation
TBD

## Usage
The service provider is used to become more independent from concrete classes and to write more flexible code. Instead of initializing concrete service classes, a service is requested at the service provider via a service definition. The service definition is connected to a service type, which is normally represented by an interface type. A service definition per service is required, as an interface type as service type only exists at designtime, but there must be a concrete type (the service definition class) which is available at runtime, which can be analyzed and which is connected to the service type.

At a central point the concrete services, which should be used in a session, have to be provided to the service provider either by setting initialized services or by providing the concrete service type class. When requesting a service the service provider initializes the services lazy on demand. *Currently only services having no constructor parameters are supported.*
After providing the services, these services can be fetched by the service provider. At that point there is no dependency anymore to concrete service implementations but instead to the abstract service type.

The following chapter shows how to provide and consume a service.

### Implement a service
At first a service has to be implemented and it has to be connected with a service definition.
So, implementing a service requires the following steps:

1. Implement the service type
```
interface ILogger {
  log(message: string): void;
}
```

2. Implement the service definition class which references the service type. This class must extend `ServiceDefinition`. It is the key which is used to provide or consume a service.
```
class LoggerService extends ServiceDefinition<ILogger> {}
```

3. Implement a variant of the the service itself.
```
class Logger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}
```

### Provide a service to the service provider
To request a service from the service provider, it has to be provided first. Normally at a central place within an application. *Currently some kind of autowiring is not supported.*
There are two ways to provide a service which is explained below.

**Hint:** Providing an already existing service type would replace the current service.

1. Put a service 

An already initialized service instance can be put to the service provider. Therefore the service definition which is connected to the abstract service type has to be injected followed by the service instance which must be of type of the abstract service type.

To put a service means it is handled as a singleton service. Each time that service is requested, the same instance will be returned.
```
const logger: ILogger = new Logger();
SP.put(LoggerService, logger);
```

2. Register a service is an alternative to putting a service. Here the service is only initialized on demand.
The registration of a service needs 3 parameter. The service class as key, which is connected to the service type. The concrete service implementation class, which should be initialized when the service is requested and the service instantiation type. The service instantiation type must be either multiple or single instantiable.
It defines if either always the same service instance is returned or that with each service request a new instance of the service is created and returned.
```
SP.register(LoggerService, Logger, ServiceInstanceType.MULTI_INSTANTIABLE);
```

### Request a service
Requesting a service means that by providing the service class a service instance of the service type is returned. The concrete implementation class of the service type is unknown, which makes it easier to replace a service.
There are two ways to request a service:

1. Fetch to fetch a service the service class has to be provided as key and returns the service. If the service doesn't exist an exception is raised.
```
const logger = SP.fetch(LoggerService);
logger.log(`Message to be logged`);
```

2. FetchOrNull is equivalent to fetch a service. But in case that the requested service doesn't exist, undefined is returned instead of raising an exception.
By operator `?.` the method `log` is only called in case the instance `logger` is not undefined.
```
const logger = SP.fetchOrNull(LoggerService);
logger?.log(`Message to be logged`);
```

### Remove a service
To remove a service from the service provider method `remove` is used. As parameter the service class has to be provided as key.
```
SP.remove(LoggerService);
```

### Check if a service exist
To write more readable code and saving memory the method `contains` returns if a service is defined in the service provider, without the need to initialize the service in case it is registered.
```
const contains = SP.contains(LoggerService);
```

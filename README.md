# service-provider.typescript
A dependency injection implementation in TypeScript by using a service provider / service locator.

## Installation
Install the service provider via:
```
npm install --save @yobuligo/service-provider.typescript
```

## Usage
The service provider is used to achieve independency from concrete classes and to write more flexible code. Instead of initializing concrete service classes, a service is requested from the service provider via a service definition. The service definition is connected to a service type, which is normally represented by an interface type.

At a central point the concrete services, which should be used in a session, have to be provided to the service provider either by setting initialized services or by providing the concrete service type class. When requesting a service the service provider initializes the services lazy on demand. 

After providing the services, these services can be fetched by the service provider. At that point there is no dependency anymore to concrete service implementations but instead to the abstract service type.

The following chapter shows how to provide and consume a service.

### Implement a service
At first a service has to be implemented and it has to be connected with a service definition. Implementing a service requires the following steps:

1. Implement the service type
```
interface ILogger {
  log(message: string): void;
}
```

2. Implement the service definition class which references the service type. This class must extend `ServiceDefinition`. It is the key which is used to provide or consume a service. 
 
A service definition per service is required, as an interface type as service type only exists at designtime, but there must be a concrete type (the service definition class) which is available at runtime, which can be analyzed and which is connected to the service type.
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
To request a service from the service provider, it has to be provided first, generally at a central place within an application. *Currently some kind of autowiring is not supported.*
There are two ways to provide a service which are explained below.

**Hint:** Providing an already existing service type would replace the current service.

1. Put a service 

*Put* is used to add an already initialized service to the service provider. Therefore the service definition, which is connected to the abstract service type, has to be injected as first parameter. As second parameter the service instance, which must be of type of the abstract service type, has to be passed.

To put a service means it is handled as a singleton service. Each time that service is requested, the same instance will be returned.
```
const logger: ILogger = new Logger();
SP.put(LoggerService, logger);
```

2. Register a service

Registering means to only provide the concrete service class, without the need to initialize the service before. Instead the service provider will initialize the service lazily on demand. *Currently only services without constructor parameters are supported.*

There are two mandatory parameters for the registration. The service definition, which is connected to the abstract service type, and the concrete service class type.

Optionally the parameter *serviceInstanceType* can be set. It defines if a new service instance is created with each request or if the service is handled as singleton, which means once the service is initialized the same instance is returned with each request. As default the *serviceInstanceType* is considered to be *SINGLE_INSTANTIABLE*.
```
SP.register(LoggerService, Logger);

SP.register(LoggerService, Logger, ServiceInstanceType.MULTI_INSTANTIABLE);
```

### Request a service
Requesting a service is possible by providing the corresponding service definition, which is connected to the abstract service type, to the methods *fetch* or *fetchOrNull*. As the service definition is connected to the abstract service type, the caller has only a dependency to that service type. The concrete service class type is unknown. Below two examples are shown for fetching services:

1. Fetch

By using *fetch* the caller expects the service to be available. The service provider returns an instance of the service type or throws an exception if the service doesn't exist.
```
const logger = SP.fetch(LoggerService);
logger.log(`Message to be logged`);
```

2. FetchOrNull
 
*FetchOrNull* is equivalent to *fetch* but in case that the requested service doesn't exist, *undefined* is returned instead of throwing an exception.
```
const logger = SP.fetchOrNull(LoggerService);
logger?.log(`Message to be logged`);
```

### Remove a service
To remove a service from the service provider, pass the service definition, which is connected to the abstract service type, to *remove*.
```
SP.remove(LoggerService);
```

### Check if a service exist
The methods *contain* and *containsNot* can be used to find out, if a service was defined in the service provider. It provides more readability and it avoids having to initialize the service by calling *fetch*.
```
const contains = SP.contains(LoggerService);

const containsNot = SP.containsNot(LoggerService);
```

0x.js is a promise-based library. This means that whenever an asynchronous call is required, the library method will return a Javascript promise. You can therefore use a `promise` syntax or an `async/await` syntax with such methods as shown below:

```javascript
zeroEx.getAvailableAddressesAsync()
    .then(function(availableAddresses) {
        console.log('Got:', availableAddresses);
    })
    .catch(function(error) {
        console.log('Caught error: ', error);
    });
```

```javascript
try {
    var availableAddresses = await zeroEx.getAvailableAddressesAsync();    
} catch (error) {
    console.log('Caught error: ', error);
}
```

As is the convention with promise-based libraries, if an error occurs, it is thrown by the method. It is the callers responsibility to catch thrown errors are handle these scenarios properly.

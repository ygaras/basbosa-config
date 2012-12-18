(function(root, factory) {
  if (typeof exports !== 'undefined') {
    // Node.js
    module.exports = factory(root);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(function() {
      return factory(root);
    });
  } else {
    // Browser globals
    root.Config = factory(root);
  }
}(this, function(root) {
  var config, defaults, loaders;
  
  defaults = {
    socketUrl : '/'
  };
  
  loaders = ['BasbosaConfig', 'Config', 'jRaw'];
  
  for ( var key in loaders) {
    if (typeof root[loaders[key]] !== 'undefined') {
      config = root[loaders[key]];
    }
  }
  
  config = config || {};
    
  for ( var key in defaults) {
    config[key] = typeof (config[key]) === 'undefined' ? defaults[key] : config[key];
  }

  var Config = {
    __config : config,
    
    read : function(index) {
      if (typeof this.__config[index] !== 'undefined') {
        return this.__config[index];
      } else {
        //Logger.warn('The value ' + index + ' is not defined in Config yet');
        return 'undefined';
      }
    },
    
    write : function(index, value) {
      this.__config[index] = value;
      return this;
    },
    
    setConfig : function(config) {
      this.__config = config;
    }
  };

  Config.get = Config.read;
  Config.set = Config.write;
  
  if (typeof Basbosa !== 'undefined')  Basbosa.add('Config', Config);
  
  return Config;
}));
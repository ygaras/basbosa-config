(function(root, factory) {
  if (typeof exports !== 'undefined') {
    // Node.js
    var Basbosa;
    try {
      Basbosa = require('basbosa-registry');
    } catch(e) {
      // Its okay, we can live without the registry
    } finally {
      module.exports = factory(root, Basbosa);
    }

  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['basbosa'], function(Basbosa) {
      return factory(root, Basbosa);
    });
  } else {
    // Browser globals
    root.BasbosaConfig = factory(root, Basbosa);
  }
}(this, function(root, Basbosa) {
 
  var Config = function(appConfig) {
    var config, defaults, loaders;
    // build in default, TODO: remove this hack!
    
    defaults = {
      socketUrl : '/',
      env : 'development'
    };
      
    // variables in the root object  to load from
    loaders = ['BasbosaConfig', 'Config', 'jRaw'];
    
    for ( var key in loaders) {
      if (typeof root[loaders[key]] !== 'undefined') {
        config = root[loaders[key]];
      }
    }
    
    config = config || {};
   
    this.config = {};
    
    this.extend(true, this.config, defaults, config, appConfig);
  };
   
  Config.prototype = {
    
    env : function(env, index, settings) {
      if (typeof index === 'object') {
        settings = index;
        index = '';
      }
      if (this.get('env').indexOf(env) > -1) return this.set(index, settings);
    },
    
    get : function(index) {
      return this.dotToObj(this.config, index || '');
    },
    
    set : function(index, value) {

      if (typeof index === 'object') {
        value = index;
        index = '';
        
      }

      var target = this.dotToObj(this.config, index);
      
      // handle overwriting scaler values
      if (typeof target !== 'object' && !Array.isArray(target)) {
        var newIndex = index.split('.')
          lastIndex = newIndex.splice(-1, 1); 
        newIndex =  newIndex.join('.');
        this.dotToObj(this.config, newIndex)[lastIndex] = value;
        return;
      }
      return this.extend(true, target, value);
    },
    
    setConfig : function(config, reset) {
      this.config = config;
    },
    
    /**
     * jQuery extend except that default is to deep copy
     */
    extend : function() {
      var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = true;

      // Handle a deep copy situation
      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
      }

      // Handle case when target is a string or something (possible in deep copy)
      if ( typeof target !== 'object' && typeof target !== 'function') {
        target = {};
      }

      // extend Config object itself if only one argument is passed
      if ( length === i ) {
        target = this.config;
        --i;
      }
      
      for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ((options = arguments[ i ]) != null) {
          // Extend the base object
          for (name in options) {
            src = target[name];
            copy = options[name];

            // Prevent never-ending loop
            if (target === copy) {
              continue;
            }

            // Recurse if we're merging plain objects or arrays
            if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
              if ( copyIsArray ) {
                copyIsArray = false;
                clone = src && (Array.isArray(src)) ? src : [];

              } else {
                clone = src && (typeof src === 'object') ? src : {};
              }

              // Never move original objects, clone them
              target[name] = this.extend(deep, clone, copy);

            // Don't bring in undefined values
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }

      // Return the modified object
      return target;
    },
    
    dotToObj : function(obj, string) {
      var parts = string.split('.');
      
      if (parts[0] === '') return obj;
      var newObj = obj[parts[0]];
      if (parts[1]) {
          parts.splice(0, 1);
          var newString = parts.join('.');
          return this.dotToObj(newObj, newString);
      }
      return newObj;
    }
  
  };


  if (typeof Basbosa !== 'undefined')  {
    Basbosa.add('Config', new Config);
  }
  
  if (typeof root.BasbosaConfig !== 'undefined')  root.BasbosaConfig = new Config();

  return Config;
}));

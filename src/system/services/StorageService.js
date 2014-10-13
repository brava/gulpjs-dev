/**
 * This service requires StorageObjectsPolyfill
 *
 * @see https://github.com/iFind/html5MultidimensionalStorage
 */
angular.module('StorageService',[]).factory('StorageService',function() {
  var self = this;

  var settings = {
    driver : 'storage'
  };

  var driver = null;

  /**
   * Storage Drivers Abstractions
   *
   * @type {{storage: {_obj: Window.localStorage, $connector: {reader: null, writer: null}, __setup: __setup, set: set, get: get, remove: remove}, files: {set: set, get: get, remove: remove}}}
   */
  var drivers = {

    /**
     * This driver implements HTML5 Local Storage ( WebStorage ) system to be used as Storage Service System
     *
     * @see http://www.w3.org/TR/webstorage/
     */
    storage : {
      //custom
      _obj : localStorage,


      //common
      $connector : {
        reader : null,
        writer : null
      },

      __setup : function(options) {
        var driver = this;

        driver.$connector.reader = driver._obj;
        driver.$connector.writer = driver._obj;
      },

      set : function(path,value) {
        return this.$connector.writer.setObj(path,value);
      },

      get : function(path) {
        return this.$connector.reader.getObj(path);
      },

      remove : function(path) {
        return this.$connector.writer.removeObj(path);
      },

      push : function(path,value) {
        var _data = this.get(path);

        _data = _data === null || typeof _data === 'undefined' ? [] : _data;

        if( Object.prototype.toString.call( _data ) === '[object Array]' ) {
          _data.push(value);
          return this.set(path,_data);
        } else {
          return undefined;
        }
      }
    },

    /**
     * This driver implements HTML5 FileAPI system to be used as Storage Service System
     * @see http://www.w3.org/TR/FileAPI/
     */
    files : {
      __setup : function(options) {

      },

      set : function(path,value) {

      },

      get : function(path) {

      },

      remove : function(path) {

      },

      push : function(path,value) {

      }
    },


    /**
     * This driver implements HTML5 PouchDB system to be used as Storage Service System
     * @see http://pouchdb.com/
     */
    pouchDB : {
      __setup : function(options) {

      },

      set : function(path,value) {

      },

      get : function(path) {

      },

      remove : function(path) {

      },

      push : function(path,value) {

      }
    }
  }

  /**
   * Initial setup for the Storage Service this enables everything that's needed to be fully compatible with the different
   * abstractions we may have
   *
   * @param driver (storage,files)
   */
  self.$setup = function(setup) {
    settings = angular.extend(settings,setup);

    driver = drivers[settings.driver];

    driver.__setup(settings);

    return self;
  };

  /**
   * Set and Save an item into the storage replacing it's value
   *
   * @param path
   * @param value
   * @returns {*}
   */
  self.$set = function(path,value) {
    return driver.set(path,value);
  };

  /**
   * Push an item into the storage without replace it's value
   * @param path
   * @param value
   */
  self.$push = function(path,value) {
    return driver.push(path,value);
  };

  /**
   * Retreive an item from the storage
   *
   * @param path
   * @returns {*}
   */
  self.$get = function(path) {
    return driver.get(path);
  };

  /**
   * Remove an item from the storage
   *
   * @param path
   * @returns {*}
   */
  self.$remove = function(path) {
    return driver.remove(path);
  };

  return self;
});
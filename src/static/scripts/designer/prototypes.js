import {md5} from "../third-party/md5.js";

/**
 * Add a replace-at-index feature for String objects.
 * @param index
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

/**
 * Add a MD5 sum property to String prototype which returns the MD5 sum of its value.
 * */
Object.defineProperty(String.prototype, 'md5sum', {
    value: function() {
        return md5(this);
  }
});
/**
 * @class Response
 */
module.exports = 
    class Response {
        /**
         * @param {Boolean} success true/false
         * @param {number} code response code
         * @param {string} message addition message
         * @param {object} data response data
         */
        constructor(success, code, message, data = null) {
          this.success = success;
          this.code = code;
          this.message = message;
          this.data = data;
        }
      }

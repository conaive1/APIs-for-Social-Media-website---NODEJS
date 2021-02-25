class SucessResponse {
  constructor(code, data, success = true) {
    this.code = code;
    this.data = data;
    this.success = success;
  }
}
module.exports = SucessResponse;

/**
 * Define RESTful API response schema
 * @field statusCode: {string | number} HTTP Code or business logic code
 * @field message: {string} response message
 * @field data: {any} response data, it be any format, such as array, object etc
 */
export interface IApiRes {
  statusCode: string | number;
  message?: string;
  data?: any;
}

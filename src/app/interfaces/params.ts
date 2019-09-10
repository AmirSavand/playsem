/**
 * API payload for PUT, PATCH and POST
 */
export interface Params {
  [param: string]: null | boolean | number | string | (number | string)[];
}

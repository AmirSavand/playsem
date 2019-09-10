/**
 * Standard API error response
 */
export interface ApiError {
  [field: string]: string | string[];

  non_field_errors?: string[];
  detail?: string;
}

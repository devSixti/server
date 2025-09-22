export interface CustomResponse {
  message: string | string[];
  info: any;
}

export type AsyncCustomResponse = Promise<CustomResponse>;
export interface CustomResponse {
  status: "success" | "error";
  message: string | string[];
  info: any;
}

export type AsyncCustomResponse = Promise<CustomResponse>;
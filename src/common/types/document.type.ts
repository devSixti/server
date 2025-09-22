export interface Document {
  type: string;
  document_id: string;
  front_picture?: string;
  back_picture?: string;
  verified?: boolean;
}

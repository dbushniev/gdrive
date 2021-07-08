import { Document } from './Document';

export interface DocumentResponse {
  files: Document[];
  nextPageToken?: string;
}
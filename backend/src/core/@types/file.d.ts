export interface UploadParamsRequest {
  filename: string
  mimeType: string
  body: Buffer
}

export interface UploadParamsResponse {
  title?: string
  key: string
}

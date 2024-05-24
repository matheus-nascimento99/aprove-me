export type UploadParams = {
  filename: string
  fileType: string
  body: Buffer
}

export abstract class Storage {
  abstract upload(params: UploadParams): Promise<{ key: string }>
  abstract delete(key: string): Promise<void>
}

export abstract class StorageDownloader {
  abstract download(key: string): Promise<void>
}

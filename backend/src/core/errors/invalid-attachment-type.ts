export class InvalidAttachmentTypeError extends Error {
  constructor(public type: string) {
    super(`Type ${type} is a invalid type to upload attachment.`)
  }
}

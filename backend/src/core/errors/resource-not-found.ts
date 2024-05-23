export class ResourceNotFoundError extends Error {
  constructor(public resourceId: string) {
    super(`Resource of id "${resourceId}" not found`)
  }
}

export abstract class Cryptographer {
  abstract encrypt(record: Record<string, unknown>): Promise<string>
}

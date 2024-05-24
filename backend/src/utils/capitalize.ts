export function capitalize(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/(?<!\p{L})\p{L}/gu, function (char) {
      return char.toUpperCase()
    })
}

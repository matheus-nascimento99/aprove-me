import { capitalize } from './capitalize'

describe('Capitalize', () => {
  it('should be able to capitalize a string', async () => {
    const string = 'jOhN DOE'
    const capitalized = capitalize(string)

    expect(capitalized).toEqual('John Doe')
  })
})

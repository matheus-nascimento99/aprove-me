import { Raw } from './raw'

it('should be able to take off any special character or spaces from string', async () => {
  const test = '+55 (11)95119-5312 '

  const raw = Raw.createFromText(test)

  expect(raw.value).toEqual('5511951195312')
})

it('should be able to return the same string if there is no one special character or space', async () => {
  const test = '5511951195312'

  const raw = Raw.create(test)

  expect(raw.value).toEqual(test)
})

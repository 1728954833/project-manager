import { empty } from '../object'
describe('object util', () => {
  it('empty', () => {
    const emptyObj = {}
    const obj = { test: 'haha' }

    expect(empty(emptyObj)).toBeTruthy()
    expect(empty(obj)).toBeFalsy()
  })
})

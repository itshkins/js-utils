import {describe, it, expect} from '@jest/globals'

import {orderBy, orderByDescending} from './order-by'

describe(`order by module`, () => {
  it(`orders by correctly with default selector`, () => {
    expect(orderBy([5, 3, 9, 0])).toEqual([0, 3, 5, 9])
    expect(orderByDescending([5, 3, 9, 0])).toEqual([9, 5, 3, 0])
  })

  it(`orders by correctly with custom selector`, () => {
    const value5 = {value: 5}
    const value3 = {value: 3}
    const value9 = {value: 9}
    const value0 = {value: 0}

    const selector = (it: { value: number }) => it.value

    expect(orderBy([value5, value3, value9, value0], selector)).toEqual([value0, value3, value5, value9])
    expect(orderByDescending([value5, value3, value9, value0], selector)).toEqual([value9, value5, value3, value0])
  })
})


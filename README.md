# DOM utils

## Installation

```bash
npm i @itshkins/js-utils@latest
```

## Usage

### Node

```js
import {orderBy, orderByDescending} from '@itshkins/js-utils'

console.log(orderBy([5, 3, 9, 0])) // [0, 3, 5, 9]
console.log(orderByDescending([5, 3, 9, 0])) // [9, 5, 3, 0]
```

```js
import {orderBy, orderByDescending} from '@itshkins/js-utils'

const value5 = {value: 5}
const value3 = {value: 3}
const value9 = {value: 9}
const value0 = {value: 0}

const selector = (it) => it.value

console.log(orderBy([value5, value3, value9, value0], selector)) // [value0, value3, value5, value9])
console.log(orderByDescending([value5, value3, value9, value0], selector)) // [value9, value5, value3, value0]
```

### Browser

```html

<script src="./node_modules/@itshkins/js-utils/dist/js-utils.js"></script>

<script>{
  console.log(jsUtils.orderBy([5, 3, 9, 0])) // [0, 3, 5, 9]
  console.log(jsUtils.orderByDescending([5, 3, 9, 0])) // [9, 5, 3, 0]
}</script>

<script>{
  const {orderBy, orderByDescending} = jsUtils

  const value5 = {value: 5}
  const value3 = {value: 3}
  const value9 = {value: 9}
  const value0 = {value: 0}

  const selector = (it) => it.value

  console.log(orderBy([value5, value3, value9, value0], selector)) // [value0, value3, value5, value9])
  console.log(orderByDescending([value5, value3, value9, value0], selector)) // [value9, value5, value3, value0]
}
</script>
```

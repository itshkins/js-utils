export type OpState = {
  name: string,
  isDefault?: boolean,
  isPending?: boolean,
  isOk?: boolean,
  isError?: boolean,
  isResolved?: boolean,
}

export const OpStates: Record<string, OpState> = {
  DEFAULT: {name: `default`, isDefault: true},
  PENDING: {name: `pending`, isPending: true},
  OK: {name: `ok`, isOk: true, isResolved: true},
  ERROR: {name: `error`, isError: true, isResolved: true},
}

export const findOpStateByName = (name: string, defaultOp = OpStates.DEFAULT) => {
  return Object.values(OpStates).find((op) => op.name === name) ?? defaultOp
}

export const runOp = async <TResult>(state: { value: OpState }, callback: () => Promise<TResult>) => {
  try {
    state.value = OpStates.PENDING
    const text = await callback()
    state.value = OpStates.OK
    return text
  }
  catch (err) {
    state.value = OpStates.ERROR
  }
}

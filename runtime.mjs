Object.assign(globalThis, (await import('./utils.mjs')));

export default (
  code,
  {
    __internal_topic_reference__,
    __internal_topic_reference__line
  } = {
    __internal_topic_reference__: undefined,
    __internal_topic_reference__line: undefined
  }
) => eval(code);

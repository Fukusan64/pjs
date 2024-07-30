import runtime, {exitCode} from './runtime.mjs';
const parser = (input, delimiter, topicReference) => {
  return input
    .split(delimiter)
    .map(v => v.replaceAll(topicReference, '__internal_topic_reference__'))
  ;
};

const runner = (code, data, topicReference) => {
  try {
    return runtime(code, {__internal_topic_reference__: data});
  } catch (e) {
    throw new Error(`${
      e
    }\n\nInvalid command: ${
      code.replaceAll(
        '__internal_topic_reference__',
        topicReference
      )
    }\nCurrent data: ${
      data
    }`);
  }
};

export default (input, delimiter, topicReference) => {
  return async inputData => {
    const code = parser(input, delimiter, topicReference);
    let data = inputData;

    for (const c of code) {
      data = await runner(c, data, topicReference);
      if (data === exitCode) return;
    }
    
    console.log(data);
  }
};

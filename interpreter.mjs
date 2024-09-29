import runtime from './runtime.mjs';
import {exit} from './utils.mjs';
const parser = (input, delimiter, topicReference) => {
  return input
    .split(delimiter)
    .map(v => v.replaceAll(topicReference, '__internal_topic_reference__'))
  ;
};

const runner = (code, lineCount, data, topicReference) => {
  try {
    return runtime(code, {
      __internal_topic_reference__: data,
      __internal_topic_reference__line: lineCount
    });
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
  const code = parser(input, delimiter, topicReference);
  return async (inputData, lineCount) => {
    let data = inputData;

    for (const c of code) {
      data = await runner(c, lineCount, data, topicReference);
      if (data === exit) return;
    }
    
    console.log(data);
  }
};

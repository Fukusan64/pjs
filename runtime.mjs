import * as utils from './utils.mjs';
Object.assign(globalThis, utils);

export const exitCode = Symbol('exitCode');
const q = exitCode;

export default (code, {__internal_topic_reference__} = {__internal_topic_reference__: undefined}) => eval(code);

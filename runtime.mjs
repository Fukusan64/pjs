import * as utils from './utils.mjs';
Object.assign(globalThis, utils);

export default (code, {__internal_topic_reference__} = {__internal_topic_reference__: undefined}) => eval(code);

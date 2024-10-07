#! /usr/bin/env node
import {parseArgs} from 'node:util';
import parser from './interpreter.mjs';
import readline from 'node:readline';
import fs from 'node:fs'
import Path from 'node:path'

const {values, positionals } = parseArgs({
  options: {
    a: { type: 'boolean' },
    p: { type: 'string' },
    t: { type: 'string' }
  },
  allowPositionals: true,
});

const IS_ALL_READ_MODE = values.a ?? false;

const DEFAULT_PIPE_OPERATOR = '|>';
const PIPE_OPERATOR = values.p || DEFAULT_PIPE_OPERATOR;

const DEFAULT_TOPIC_REFERENCE = '@';
const TOPIC_REFERENCE = values.t || DEFAULT_TOPIC_REFERENCE;

const command = positionals.join(' ');

if (!command) {
  const help = 
    [
      `Version: ${JSON.parse(fs.readFileSync(Path.join(import.meta.dirname, 'package.json'))).version}`,
      'pjs [options] code',
      '',
      'options',
      '    -a                  : load all mode',
      `    -p [PIPE_OPERATOR]  : default "${DEFAULT_PIPE_OPERATOR}"`,
      `    -t [TOPIC_REFERENCE]: default "${DEFAULT_TOPIC_REFERENCE}"`,
      '',
      'example',
      '    $ ls | pjs "@.length + \':\' + @ |> @.split(\':\')"',
      '',
      'utils',
      '    [TOPIC_REFERENCE]line',
      '        Number of lines currently being processed (0 indexed). If the " -a " option is specified, the number of input lines.',
      '    p',
      '        const p = (data) => {console.log(data);return data;}',
      '    e',
      '        const e = (data) => {console.error(data);return data;}',
      '    exit',
      '        When this value is passed to the pipe operator, the currently running process stops',
      '    G',
      '        Global object',
    ]
    .join('\n')
  ;
  console.error(help);
  process.exit(1);
}

const processing = parser(
  command ?? '',
  PIPE_OPERATOR,
  TOPIC_REFERENCE,
);

const rl = readline.createInterface({ input: process.stdin });
let input = '', count = 0;
if (IS_ALL_READ_MODE) {
  for await (const line of rl) {
    input += line;
    count++;
  };
  processing(input, count);
} else {
  for await (const line of rl) {
    await processing(line, count);
    count++;
  }
}

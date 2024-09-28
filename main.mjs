#! /usr/bin/env node
import minimist from 'minimist';
import parser from './interpreter.mjs';
import readline from 'node:readline';
import fs from 'node:fs'
import Path from 'node:path'

const argv = minimist(process.argv.slice(2));
const IS_ALL_READ_MODE = Object.keys(argv).some(v => v === 'a');

const PIPE_OPERATOR = argv.d;
const DEFAULT_PIPE_OPERATOR = '|>';

const TOPIC_REFERENCE = argv.t;
const DEFAULT_TOPIC_REFERENCE = '@';

const command = argv._[0] ?? (argv.a === true ? undefined : argv.a);

if (command === undefined) {
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
      '        Number of rows currently being processed (0 indexed). " -a" option is specified, the number of input rows is returned.',
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
  PIPE_OPERATOR ?? DEFAULT_PIPE_OPERATOR,
  TOPIC_REFERENCE ?? DEFAULT_TOPIC_REFERENCE,
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

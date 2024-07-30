import minimist from 'minimist';
import parser from './interpreter.mjs';
import readline from 'node:readline';
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
      'pjs [options] code',
      '',
      'options',
      '    -a                  : load all mode',
      `    -p [PIPE_OPERATOR]  : default "${DEFAULT_PIPE_OPERATOR}"`,
      `    -t [TOPIC_REFERENCE]: default "${DEFAULT_TOPIC_REFERENCE}"`,
      '',
      'example',
      '    $ ls | pjs "@.length + \':\' + @ |> @.split(\':\')"',
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

if (IS_ALL_READ_MODE) {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  processing(input);
} else {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) await processing(line);
}

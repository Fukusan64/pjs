# pjs
```sh
$ pjs [options] code
```

## options
* `-a`
  * load all mode
* `-p [PIPE_OPERATOR] `
    * default "`|>`"
* `-t [TOPIC_REFERENCE]`
    * default "`@`"

## example
```sh
$ ls | pjs "@.length + ':' + @ |> @.split(':')"
```

## utils
* [TOPIC_REFERENCE]line
  * Number of lines currently being processed (0 indexed). If the " -a " option is specified, the number of input lines.
* p
    * `const p = (data) => {console.log(data);return data;}`
* e
    * `const e = (data) => {console.error(data);return data;}`
* exit
    * When this value is passed to the pipe operator, the currently running process stops
* G
    * Global object

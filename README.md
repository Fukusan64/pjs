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

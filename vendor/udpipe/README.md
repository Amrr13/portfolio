# Arabic parser assets

The Windows and Linux x64 executables are unchanged from the official
[UDPipe 1.3.1 release](https://github.com/ufal/udpipe/releases/tag/v1.3.1).
UDPipe is developed by the Institute of Formal and Applied Linguistics at
Charles University. Its [source code](https://github.com/ufal/udpipe/tree/v1.3.1)
is available under [MPL 2.0](LICENSE-UDPipe.txt), with third-party notices
included in the license file.

`arabic-pud.udpipe` is a model trained for this demo on
[UD Arabic PUD](https://universaldependencies.org/treebanks/ar_pud/index.html),
© the Universal Dependencies Arabic PUD contributors. The [pinned treebank
repository](https://github.com/UniversalDependencies/UD_Arabic-PUD/tree/c606299bc9eb8baa6c61c8dd3efc9a0fbf73aa87)
lists contributors and the source material. The model is distributed under
[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Its
training data contains news and encyclopedia prose, so role and case
predictions for ambiguous and colloquial text can be unreliable.

To reproduce the training split, read `ar_pud-ud-test.conllu` from this
revision as UTF-8 and split it into sentence blocks on blank lines. Put blocks
with zero-based index divisible by 10 in `holdout.conllu` and the rest in
`train.conllu`, with a blank line after each block. Train with UDPipe 1.3.1.

```sh
udpipe --train --tokenizer=epochs=16 --tagger=iterations=12 \
  '--parser=iterations=10;hidden_layer=120;structured_interval=0' \
  --heldout=holdout.conllu arabic-pud.udpipe train.conllu
```

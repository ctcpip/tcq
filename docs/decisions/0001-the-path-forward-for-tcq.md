# The path forward for TCQ

## Context and Problem Statement
[TCQ](https://tcq.com), the _queue management_ for TC39 has been in use for years. It has been initially been [developed by Brian Terlson](https://github.com/bterlson/tcq) but development has _stalled_ and its operation has become cumbersome.

Yet, we as TC39 still heavily rely on it and have to deal with its problems. There are a lot of new features to be desired and thus the current situation is not bearable any more.
## Considered Options
* continue development of TCQ
* do a complete rewrite of TCQ
* make TCQ operational again and do a complete rewrite of TCQ

## Decision Outcome

Chosen option: "make TCQ operational again and do a complete rewrite of TCQ", because continuing development of TCQ is very cumbersome:
* it is using an ancient (`8`) version of Node
* it has been developed, very "organically", with a dead code left
* it is using a very homegrown build system, that is hard to fathom and hard to adapt (`webpack`, _compiled_ `node-sass`).

Instead we supplied a [Docker](https://www.docker.com)_-based_ _builder_, allowing to _run_ and _build_ it on contemporary systems. Because TCQ was tightly coupled to Azure, a very _small_ adapter infrastructure was put into place, _adapting_ **both** _storing meetings_ **and** _storing session_. This can be configured, _dynamically_, with **now** simply _adding_ an _adapter_ and enable it via the _environment_. This allows to _deploy_ the application to _any_ hosting environment.
Adapters for both [MongoDB](https://www.mongodb.com/) and [DynamoDB](https://aws.amazon.com/de/dynamodb/) have been added. The _old_ CosmoDB ones have been extracted as well, so _in theory_(TM)  it would be possible to use it as before.

This allows _operating_ old TCQ, while we now have the possibility to come up with a rewrite. _Keeping_ as much code of the original TCQ as possible, will reduce adding new errors.

### Consequences
* Good, because we can regain control of the existing TCQ. We can always fallback to either the old one reloaded or the old one, if the new one fails.
* Bad, because a rewrite is always a certain effort that needs to be done. Adding additional adapters might introduce errors not seen before.

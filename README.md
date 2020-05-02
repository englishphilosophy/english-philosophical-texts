# English Philosophical Texts

*English Philosophical Texts* is a collection of early English language
philosophical texts published in Britain between 1650 and 1830. It provides the
substance for [Hume Texts Online](https://davidhume.org) and [English
Philosophical Texts Online](https://englishphilosophy.org), where these texts
can be read and searched.

The texts are stored in [Markit](https://github.com/englishphilosophy/markit)
format, from which they can be automatically converted to TEI-XML or HTML. Refer
to the [Markit](https://github.com/englishphilosophy/markit) repository for
further details.

Note that this project is still in its early stages. Only around 10% of the
projected corpus has been imported, and many of those texts are still being
checked and edited.

## Lexicon

This repository also includes a lexicon grouping every word in these texts into
a smaller number of lemmas. This is used by [English Philosophical Texts
Online](https://englishphilosophy.org) to lemmatize the texts, before performing
stylistic analyses.

## Ambiguous Words

Note that some words have a `` ` `` character at the end. This is to ensure that
they are mapped to the appropriate lemma. For example, the word "leaves" could
be the third person present singular of the verb "leave" or the plural of the
the noun "leaf"; the former is written in these texts as `"leaves"`, while the
latter is written as ``"leaves`"``.

No attempts are made to disambiguate words more generally. For example, the
words "alarm" and "alarms" both map to the same lemma "alarm", even though both
may occur as either a verb or a noun. Disambiguation on a larger scale would be
unfeasible, and is kept to a minimum here.

For a full list of disambiguated words, search the `lexicon.yml` file for the
`` ` `` character.

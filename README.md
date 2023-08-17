# English Philosophical Texts

_English Philosophical Texts_ is a collection of early English language
philosophical texts published in Britain between 1650 and 1830. It provides the
substance for [Hume Texts Online](https://davidhume.org) and [English
Philosophical Texts Online](https://englishphilosophy.org), where these texts
can be read and searched.

Note that this project is still in its early stages. Only around 10% of the
projected corpus has been imported, and many of those texts are still being
checked and edited.

## The (Source) Texts

The texts are stored in the `texts` directory in
[Markit](https://github.com/englishphilosophy/markit) format, from which they
can be automatically converted to TEI-XML or HTML.

See the
[GUIDELINES](https://github.com/englishphilosophy/english-philosophical-texts/blob/main/GUIDELINES.md)
file for further details and editorial principles.

### Lexicon

The `texts` directory also includes a lexicon grouping every word in these texts
into a smaller number of lemmas. This is used by to lemmatize the texts, before
performing some stylistic analyses.

### Ambiguous Words

Note that some words have a `` ` `` character at the end. This is to ensure that
they are mapped to the appropriate lemma. For example, the word "leaves" could
be the third person present singular of the verb "leave" or the plural of the
the noun "leaf"; the former is written in these texts as `"leaves"`, while the
latter is written as `` "leaves`" ``.

No attempts are made to disambiguate words more generally. For example, the
words "alarm" and "alarms" both map to the same lemma "alarm", even though both
may occur as either a verb or a noun. Disambiguation on a larger scale would be
unfeasible, and is kept to a minimum here.

For a full list of disambiguated words, search the `lexicon.yml` file for the ``
` `` character.

## The (Built) Texts and Analyses

The `bin/build.ts` script generates several JSON files from the Markit:

- JSON files for each text, with the text itself formatted as HTML.
- JSON files for each text, with the text itself stripped of all markup. This is
  used for searching.
- JSON files for each text containing analytical data concerning word usage.

These are output to the `build` directory, and committed to source control.
(They're committed to source control simply because that makes it possible to
create a free deployment of the server directly from this repository.)

The `bin/build.ts` script also generates some files in a `tmp` directory (not
committed to source control) that are used for building the lexicon.

## The Server

The `bin/serve.ts` script starts a sever on port 3001 from which you can `GET`
all the JSON files, and `POST` to search the texts. This is deployed using [Deno
Deploy](https://deno.com/deploy) at
[https://ept.deno.dev](https://ept.deno.dev).

The available endpoints are:

| Method | URL                                    | Purpose                                                                                      | Result Type                |
| ------ | -------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------- |
| `GET`  | `https://ept.deno.dev/`                | Get all authors                                                                              | `Author[]`                 |
| `GET`  | `https://ept.deno.dev/index`           | Synonym of the above                                                                         | `Author[]`                 |
| `GET`  | `https://ept.deno.dev/authors`         | Synonyn of the above                                                                         | `Author[]`                 |
| `GET`  | `https://ept.deno.dev/lexicon`         | Get the lexicon as a record of lemmas mapping to arrays of all their forms                   | `Record<string, string[]>` |
| `GET`  | `https://ept.deno.dev/lexicon-flat`    | Get the lexicon as a record of forms mapping to their lemmas                                 | `Record<string, string>`   |
| `GET`  | `https://ept.deno.dev/lexicon-reduced` | Get the lexicon as an array of arrays of forms, where the first element of each is the lemma | `string[][]`               |
| `GET`  | `https://ept.deno.dev/mit/{id}`        | Get the author or text with the given ID, with paragraph text in Markit format               | `Author | Text`            |
| `GET`  | `https://ept.deno.dev/html/{id}`       | Get the author or text with the given ID, with paragraph text in HTML format                 | `Author | Text`            |
| `GET`  | `https://ept.deno.dev/analysis/{id}`   | Get the analysis of the author or text with the given ID                                     | `Analysis`                 |
| `POST` | `https://ept.deno.dev/search`          | Search the texts, with the `POST`ed `QueryParams`                                            | `SearchResult[]`           |

Requests and responses are all JSON. See the types in `src/types` for the
details.

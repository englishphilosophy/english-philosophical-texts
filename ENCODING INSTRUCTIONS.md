# English Philosophical Texts Project: Instructions for Typists

## 1. Background

The aim of the English Philosophical Texts Project is to create critical
editions of our target texts, but without (at least in the first instance) any
detailed critical apparatus or editorial notes. Consequently, the aim is not to
produce detailed digital encodings of the source materials, except insofar as
these are necessary in the production of the critical editions. For practical
purposes, this means that we will not be recording page breaks or numbering from
the printed source, nor will we be recording the original symbols used in
footnote anchors (\*, †, ‡, §, etc.). Instead, we will be giving each paragraph
and note in the text a unique identifier (details below).

### 1.1. Markit and TEI-XML

Ultimately the goal is to produce texts encoded as TEI-compliant XML, since this
is the standard format for use in projects like these. For several reasons,
however, encoding the texts manually in this format is undesirable:

  - XML is a very verbose markup language, making it difficult and time
    consuming for human beings to produce by hand.
  - Specialist knowledge, both of XML and of the TEI schema in particular, would
    be required of our typists.
  - Errors—in the form of unmatched or malformed XML tags—are very easily
    produced.
  - Texts stored as XML are not very easy or pleasant for the human eye to
    parse, making the identification and correction of typographical errors
    harder.

To eliminate these problems, a terse markup language called _Markit_ has been
designed as part of this project. Markit is inspired by Markdown (a terse markup
language that compiles to HTML), and it uses a very similar syntax. Markit
differs from Markdown, however, in two key respects: first, it is primarily
designed to compile to TEI-XML (although it can also compile to HTML); second,
it includes a different (albeit overlapping) set of features, geared towards the
particular needs of projects like these.

A Markit file is a UTF-8 text file with a `.mit` extension. We recommend
creating and editing Markit files using the [Atom text editor](https://atom.io),
for which we have created a `language-markit` package. To install this package,
open Atom’s settings tab (from the ‘File’ menu), click ‘+ Install’, and search
for ‘language-markit’ in the ‘Search packages’ box. With this package installed,
Atom will recognise files with a `.mit` extension as Markit files, and will use
the appropriate syntax highlighting. You can also use the ‘Edit -> Reflow
Selection’ command to automatically break paragraphs down into a sequence of
shorter lines (`Ctrl-Shift-Q` on Windows, or `Cmd-Alt-Q` on Mac). While not
necessary, we strongly recommend that lines of text in a Markit file do not
exceed 80 characters; this makes the syntax highlighting work better, and also
makes the file much nicer on the human eye. The ‘Reflow Selection’ command help
you do this automatically.

### 1.2. Text structure, filenames, and metadata

The texts to be encoded will be given assorted metadata (publication dates,
publishers, copytexts, license information, etc.), and will be broken down into
volumes, books, parts, chapters, sections, etc. Typists do not need to be
concerned with any of this directly, since it will be handled by the project
editor, but it is presumably helpful to have a rough idea of what is going on.

A TEI-XML file consists of two elements: a `<teiHeader>` element, which contains
the metadata, and a `<text>` element, which contains the text itself. This
`<text>` element may be further broken down into a `<front>` element (for front
matter), a `<body>` element (for the body of the work), and a `<back>` element
(for back matter); the `<body>` element may then be further subdivided into
various nested `<div>` elements (for volumes, books, parts, chapters, sections,
etc.).

The structure of a Markit file is similar in one respect, and different in
another. Like a TEI-XML file, it consists of two parts. The first part, enclosed
in lines with three dashes (`---`), contains metadata in
[YAML](https://yaml.org) format (as in the GitHub flavour of Markdown). This
corresponds to the `<teiHeader>` tag of a TEI-XML file. The second part is the
text itself, which corresponds to the `<text>` tag of the TEI-XML file. Unlike a
TEI-XML file, however, the text part of a Markit file is simply a sequence of
paragraphs (with an optional title at the start); it does not support further
subdivisions into front matter, back matter, volume, book, chapter, etc.
Instead, Markit represents subdivisions like these by producing separate files
(one for each division), and then referencing these files in the metadata of a
parent file. For example, a Markit file for David Hume’s _Treatise of Human
Nature_ would contain references to three separate files, one for each book or
volume; those three files would then each contain references to separate files
for their several parts; those files would, in turn, each contain references to
separate files for their several sections; and these files, finally, would
contain the textual content (i.e. the sequence of paragraphs) of each section.

References from one Markit file to another take the form of relative file paths,
and consequently the file being referred to can reside anywhere else on the same
hard drive. By convention, however, files should be stored in a directory
structure that mirrors the structure of the work itself, with each directory
containing an `index.mit` file. Thus Hume’s _Treatise_ would have a main
`index.mit` file alongside three subdirectories (one for each book); those
subdirectories would each have their own `index.mit` file and subdirectories
(one for each part); and those subdirectories would each have an `index.mit`
file and one file for each section (called `1.mit`, `2.mit`, `3.mit`, etc.). For
this project, filenames and directory structures will follow this convention,
with one general exception: since files are ultimately grouped in separate
directories for each author, the individual letters in works consisting of
published correspondence will be split across two directories (one residing in
the directory of each correspondent). We will effectively be producing two
copies of each of these works (one for each author), although the text for each
individual letter will only be stored once.

### 1.3. Starting point

As stated above, typists need not be concerned with filenames, directory
structure, or metadata, since all of these things will be handled by the project
editor. From the editor, typists will be provided with: (i) several Markit
files, arranged in the appropriate directory structure, and containing some
metadata (metadata may be incomplete when you receive the file, but don’t worry
about this); (ii) several PDF files, consisting of the smallest units of the
text to be encoded, arranged in a parallel directory structure and with parallel
filenames. Typically there will be more Markit files than there are PDF files,
since some Markit files—namely the ‘index.mit’ files in each
directory—correspond to higher-level structures in the work, which group
together the smaller units.

The job of typists is to fill in the text part of the relevant Markit files
(i.e. the part following the metadata), by transcribing the corresponding PDF
file. The rules governing this transcription are explained in the next section.

## 2. Output

In plain terms, typists should transcribe the complete text, including section
titles, formatting, block and inline quotations, foreign text, margin comments,
footnotes, etc. Page breaks, page numbers, and line breaks should be ignored, as
should hyphens introduced simply because the word crosses a line break. Some
very basic critical markup should be added, in the form of numbers for each
paragraph and each footnote. In the latter case, these numbers should replace
the symbol used to identify the footnote in the original text (\*, †, ‡, §,
etc.).

Additional critical markup—identifying named individuals, citations, and
correcting typographical errors is the source text—may be included, but need not
be (ultimately these things are the responsibility of the project editor). The
correction of typographical errors explicitly noted in any official ERRATA
sheets published with the original work would be particularly welcome.

For all markup, optional and required, the general rule is simple: _if in
doubt, leave it out_, and simply transcribe the plain text unadorned. And, of
course, feel free to contact that project editor if you encounter anything not
covered by this document, or which you feel requires special treatment.

### 2.1. Required output

#### 2.1.1. Paragraphs and paragraph numbers

The basic units of text within each section are its _paragraphs_. In Markit, a
paragraph is represented by a single block of text with no more than one
consecutive line break anywhere inside it. Single line breaks may be used
anywhere in the paragraph for the sake of readability, and we encourage you to
use them throughout to ensure that no single line of text exceeds 80 characters
in length. (Or better yet, just use Atom’s ‘Reflow Selection’ feature to
automate this process, as explained above.) Markit treats a single line break as
equivalent to a single space (and any additional spaces at the end of a line are
ignored). Use two consecutive line breaks to indicate the start of a new
paragraph.

For example, the first two paragraphs of the first section of Hume’s
_Dissertation on the Passions_ would start out, in Markit, looking like this:

```
1. SOME objects produce immediately an agreeable sensation, by the original
structure of our organs, and are thence denominated Good; as others, from their
immediate disagreeable sensation, acquire the appellation of Evil. Thus moderate
warmth is agreeable and good; excessive heat painful and evil.

Some objects again, by being naturally conformable or contrary to passion,
excite an agreeable or painful sensation; and are thence called Good or Evil.
The punishment of an adversary, by gratifying revenge, is good; the sickness of
a companion, by affecting friendship, is evil.
```

(To be clear, this is not how they will ultimately look, when all relevant
markup has been added. We will keep adding to these paragraphs in the remainder
of this document, by way of illustration.)

Paragraphs in Markit can optionally being with some properties enclosed in
curly brackets `{}`. Typists need only be concerned with the ID property, which
is a number preceded by the hash symbol `#`. When transcribing a section, every
paragraph should be given a number consecutively, starting at 1. Thus the first
two paragraphs from the _Disseration on the Passions_ become:

```
{#1} 1. SOME objects produce immediately an agreeable sensation, by the original
structure of our organs, and are thence denominated Good; as others, from their
immediate disagreeable sensation, acquire the appellation of Evil. Thus moderate
warmth is agreeable and good; excessive heat painful and evil.

{#2} Some objects again, by being naturally conformable or contrary to passion,
excite an agreeable or painful sensation; and are thence called Good or Evil.
The punishment of an adversary, by gratifying revenge, is good; the sickness of
a companion, by affecting friendship, is evil.
```

Note that if you are using Atom, with the `langage-markit` extension installed,
these ID tags will be highlighted in a different colour, making the text much
easier to read and maintain.

#### 2.1.2. Section headings

Most sections of text begin, not with the first paragraph, but with a heading or
title of some kind. In Markit, these are represented by a paragraph that beings
with the special `{title}` tag. Titles themselves are sandwiched in between two
pound symbols followed by a number between 1 and 6 (`£1`, `£2`, ..., `£6`). The
number corresponds to the font size of the heading, with 1 being the largest and
6 the smallest. (This is analogous to the `<h1>`, `<h2>`, ..., `<h6>` heading
tags used in HTML.) Thus the first section of the _Dissertation_ should in fact
begin like this:

```
{title}
£1 SECT I. £1

{#1} 1. SOME objects produce immediately an agreeable sensation, by the original
structure of our organs, ... [etc.]
```

All of the additional markup that can be included in paragraphs (italics, small
capitals, footnote anchors, etc.), described in detail below, can also be used
in titles in exactly the same way.

#### 2.1.3.Italics and small capitals



#### 2.1.4. Margin comments



#### 2.1.5. Quotations



#### 2.1.6. Foreign text



#### 2.1.7. Footnotes



#### 2.1.8. Ampersands



#### 2.1.9. Ligatures



#### 2.1.10. White space



### 2.2. Optional output

#### 2.2.1. Names



#### 2.2.2. Citations



#### 2.2.3. Corrections

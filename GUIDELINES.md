# English Philosophical Texts Project: Instructions for Typists

## 1. Background

The aim of the English Philosophical Texts Project is to create critical
editions of our target texts, but without (at least in the first instance) any
detailed critical apparatus or editorial notes. Consequently, the aim is not to
produce detailed digital encodings of the source materials, except insofar as
these are necessary in the production of the critical editions. For practical
purposes, this means that we will not be recording page breaks or numbering from
the printed sources, nor will we be recording the original symbols used in
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
  - Errors&mdash;in the form of unmatched or malformed XML tags&mdash;are very
    easily produced.
  - Texts stored as XML are not very easy or pleasant for the human eye to read,
    making the identification and correction of typographical errors harder.

To eliminate these problems, a terse markup language called
[Markit](https://github.com/englishphilosophy/markit) has been designed as part
of this project. Markit is inspired by Markdown (a terse markup language that
compiles to HTML), and it uses a very similar syntax. Markit differs from
Markdown, however, in two key respects: first, it is primarily designed to
compile to TEI-XML (although it can also compile to HTML); second, it includes a
different (albeit overlapping) set of features, geared towards the particular
needs of projects like these.

A Markit file is a UTF-8 text file with a `.mit` extension. We recommend
creating and editing Markit files using the [Atom](https://atom.io) text editor,
for which we have created a `language-markit` package. To install this package,
open Atom's settings tab (from the 'File' menu), click '+ Install', and search
for 'language-markit' in the 'Search packages' box. With this package installed,
Atom will recognise files with a `.mit` extension as Markit files, and will use
the appropriate syntax highlighting. This syntax highlighting, as well as making
the files easier to read, will make it much easier to spot syntax errors.

In Atom, you can also use the 'Edit -> Reflow Selection' command to break
paragraphs down into a sequence of shorter lines (`Ctrl-Shift-Q` on Windows, or
`Cmd-Alt-Q` on Mac). While not necessary, we strongly recommend that lines of
text in a Markit file do not exceed 80 characters; this makes the syntax
highlighting work better, and also makes the file much nicer to read. The
'Reflow Selection' command can help you to do this automatically.

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
Instead, Markit represents subdivisions like these through separate files (one
for each division), which can then be referred to in the metadata of a parent
file. For example, a Markit file for David Hume's _Treatise of Human Nature_
would contain references to three separate files, one for each book or volume;
those three files would then each contain references to separate files for their
several parts; those files would, in turn, contain references to separate files
for their several sections; and these files, finally, would contain the textual
content (i.e. the sequence of paragraphs) of each section. The generated TEI-XML
file will place all of these things in nested `<div>` elements accordingly.

References from one Markit file to another take the form of relative file paths,
and consequently the file being referred to can reside anywhere on the same hard
drive. By convention, however, files should be stored in a directory structure
that mirrors the structure of the work itself, with each directory containing a
main `index.mit` file. Thus the root directory for Hume's _Treatise_ would have
a main `index.mit` file alongside three subdirectories (one for each book);
those subdirectories would each have their own `index.mit` file and
subdirectories (one for each part); and _those_ subdirectories would each have
an `index.mit` file and one file for each section (called `1.mit`, `2.mit`,
`3.mit`, etc.). For this project, filenames and directory structures will follow
this convention, with one general exception: since the texts are all ultimately
grouped in separate directories for each author, the individual letters in works
consisting of published correspondence will be split across two directories (one
residing in the directory of each correspondent). We will effectively be
producing two copies of each of these works (one for each author), although the
text for each individual letter will only be stored once.

### 1.3. Starting point

As stated above, typists need not be concerned with filenames, directory
structure, or metadata directly, since all of these things will be handled by
the project editor. From the editor, typists will be provided with:

  1. Several Markit files, arranged in the appropriate directory structure, and
     containing some metadata (metadata may be incomplete when you receive the
     file, but don't worry about this).
  2. Several PDF files, consisting of the smallest units of the text to be
     encoded, arranged in a parallel directory structure and with parallel
     filenames.

Typically there will be more Markit files than there are PDF files, since some
Markit files&mdash;namely the `index.mit` files in each
directory&mdash;correspond to higher-level structures in the work, which group
together the smaller units.

The job of typists is to fill in the text part of the relevant Markit files
(i.e. the part following the metadata), by transcribing the corresponding PDF
files. The rules governing this transcription are explained in the next section.

## 2. Output

In plain terms, typists should transcribe the complete text, including section
titles, formatting, block and inline quotations, foreign text, margin comments,
citations, and footnotes. Page breaks, page numbers, and line breaks should be
ignored. Some very basic critical markup should be added, in the form of numbers
for each paragraph and each footnote. In the latter case, these numbers should
replace the symbol used to identify the footnote in the original text (\*, †, ‡,
§, etc.).

Additional critical markup&mdash;identifying named individuals, citations, and
correcting typographical errors in the source text&mdash;may be included, but
need not be (ultimately these things are the responsibility of the project
editor). The correction of typographical errors explicitly noted in any official
ERRATA sheets published with the original work would be particularly welcome.

For all markup, optional and required, the general rule is simple: _if in doubt,
leave it out_, and simply transcribe the text unadorned. And, of course, feel
free to contact that project editor if you encounter anything not covered by
this document, or which you feel requires special treatment.

### 2.1. Required output

#### 2.1.1. Paragraphs and paragraph numbers

The basic units of text within each section are its _paragraphs_. In Markit, a
paragraph is represented by a single block of text with no more than one
consecutive line break anywhere inside it. Single line breaks may be used
anywhere in the paragraph for the sake of readability, and we encourage you to
use them throughout to ensure that no line of text exceeds 80 characters in
length (or better yet, just use Atom's 'Reflow Selection' feature to automate
this process, as explained above). Markit treats a single line break as
equivalent to a single space (and any additional spaces at the start or end of a
line are ignored). Use two consecutive line breaks to indicate the start of a
new paragraph.

For example, the first two paragraphs of the first section of Hume's
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
markup has been added. Additional markup will be illustrated as we proceed.)

Paragraphs in Markit can optionally begin with some properties enclosed in
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

Note that the printed number `1.` at the start of the first paragraph in the
text is distinct from the ID tag, and _both_ must be included. The numbers in
this printed text correspond to subsections created by Hume himself, subsections
which typically span several paragraphs. However, if, in a source text, there
are printed numbers at the start of _every_ paragraph, and which correspond
exactly to the ID tags, then these printed numbers should be omitted. (This is
the case, for example, in our source text for Locke's _Essay Concerning Human
Understanding_.) If you are uncertain whether printed numbers at the start of
paragraphs of text should be included or not, please check with the project
editor.

Paragraph numbering should be reset at the start of each section. The first
paragraph of section 2 of Hume's _Disseration_, for example, will also be
numbered `{#1}`.

#### 2.1.2. Section headings

Most sections of text begin, not with the first paragraph, but with a heading or
title of some kind. In Markit, these are represented by a paragraph that beings
with the special `{title}` tag. Titles themselves are sandwiched in between two
pound symbols followed by a number between 1 and 6 (`£1 ... £1`, `£2 ... £2`,
..., `£6 ... £6`). The number corresponds to the font size of the heading, with
1 being the largest and 6 the smallest. (This is analogous to the `<h1>`,
`<h2>`, ..., `<h6>` heading tags used in HTML.) Thus the first section of the
_Dissertation_ should in fact begin like this:

```
{title}
£1 SECT I. £1

{#1} 1. SOME objects produce immediately an agreeable sensation, by the original
structure of our organs, [... etc.]
```

All of the additional markup that can be included in paragraphs (italics, small
capitals, footnote anchors, etc.), described in detail below, can also be used
in titles in exactly the same way.

#### 2.1.3. Italics and small capitals

In our source texts, the only formatting variations are italic text and text in
small capital letters. These should be sandwiched in between underscore `_` and
caret `^` symbols respectively. Thus the first two paragraphs of Hume's
_Dissertation_, when marked-up fully, should look like this:

```
{#1} 1. SOME objects produce immediately an agreeable sensation, by the original
structure of our organs, and are thence denominated ^Good^; as others, from
their immediate disagreeable sensation, acquire the appellation of ^Evil^. Thus
moderate warmth is agreeable and good; excessive heat painful and evil.

{#2} Some objects again, by being naturally conformable or contrary to passion,
excite an agreeable or painful sensation; and are thence called _Good_ or
_Evil_. The punishment of an adversary, by gratifying revenge, is good; the
sickness of a companion, by affecting friendship, is evil.
```

Note the words "Good" and "Evil" are in small capitals in the first paragraph,
and italicized in the second.

##### 2.1.3.1. Nested formatting

When something that is not italicized occurs within an italicized
phrase&mdash;such as a footnote anchor, or some unitalicized text in small
capitals&mdash;you should _not_ break up the larger italicized phrase, but
simply embed the smaller phrase as if it were in italics. (When our texts our
displayed on the web, these formatting niceties will be taken care of
automatically.) For example, consider the following passage from the start of
Hume's essay on the British government:

```
Notwithstanding this unlucky example, I will venture to examine an important
question, to wit, _Whether the ^British^ government inclines more to absolute
monarchy, or to a republic; and in which of these two species of government it
will most probably terminate?_ As there seems not to be any great danger of a
sudden revolution either way, I shall at least escape the shame attending my
temerity, if I should be found to have been mistaken.
```

In the printed text, the word "British" is in small capitals and _not_
italicized (in fact, in our source texts, small capitals are _never_ rendered
in italics). Nevertheless, in transcribing this you should _not_ break the
italicized phrase into two separate parts, with the small capitals text in the
middle, like so:

```
_Whether the_ ^British^ _government inclines more to absolute monarchy, or to a
republic; and in which of these two species of government it will most probably
terminate?_
```

This more convoluted markup is unnecessary, and does not reflect the implicit
structure of the text; when we render the texts on our sites, we will always
show small capitals as unitalicized, whether or not they occur within an
italicized phrase.

Sometimes whole paragraphs or sections of texts (often prefaces) are rendered
in italics. In these cases, you should enclose each paragraph entirely in
underscores (formatting markup cannot span multiple paragraphs, and so must be
applied individually to each one).

When a whole paragraph or section of text is in italics, ordinary unitalicized
text is sometimes used for emphasis. This should be marked up as italic text
embedded within italic text; for example:

```
_The Subject of this Correspondence is the best and greatest that the Thought of
an intelligent Creature can possibly exercise it self about, _the Love of GOD_.
And 'twere much to be wished that this were made more the Subject not only of
our Conversations and Letters [... etc.]_
```

Note that the whole paragraph here is enclosed in underscores, as is the phrase
`the Love of God` within that. Markit will handle the formatting here for you
(rendering the embedded italics as ordinary text).

##### 2.1.3.2. Formatting and surrounding punctuation

It is not always obvious or even determinate where exactly formatting in italics
or small capitals should end. Proper names are often rendered in small capitals
in our source texts, and these in turn are often possessives, ending in
"&rsquo;s". In these cases, the apostrophe and the "s" should be rendered
_outside_ the span of the small capitals. With italicized text, the main issues
concern whether any surrounding punctuation marks should also be italicized. As
a general rule, surrounding punctuation should _not_ be included in italicized
text, unless the whole sentence is italicized. In these cases, the concluding
full-stop, question mark, exclamation mark, or colon should also be included. It
is a consequence of the general rule that concluding commas or semi-colons at
the ends of italicized phrases should _not_ generally be included (even if, in
the source text, the punctuation looks as though it is italicized).

Comma separated lists are a notable case. These may often begin with "viz." in
italics, which should be rendered in a separate italicized span, apart from the
list itself. As for that list, whether it should be one long italicized span, or
several separate ones (one for each element in the list), depends on whether the
"and" preceding the last item is in italics. For example, if the whole list,
including the "and" at the end, is in italics, then it should be rendered like
so:

```
_viz._, _the first item, the second item, the third, and the fourth_.
```

If, however, the "and" at the end is not italicized, then the several items
should each be italicized individually; thus:

```
_viz._, _the first item_, _the second item_, _the third, and _the fourth_.
```

#### 2.1.4. Margin comments

Comments in the margins of our source texts (which usually serve as markers
indicating the topic being addressed in the main text) should be enclosed in
hash tags `#`. For example:

```
{#1} #Occasion of this INQUIRY.# RELIGION and VIRTUE appear in many respects so
nearly related, that they are generally presum'd inseparable Companions. And so
willing we are to believe well of their _Union_, that we hardly allow it just to
speak, or even think of 'em apart. [...]
```

It is not always obvious where, in the flow of a paragraph, a margin comment
ought to be placed. Try to place them at the _start_ of the sentence to which
they most obviously apply, and try to avoid placing them in the middle of
sentences. If they must go in the middle of a sentence, try to place them after
a comma or other punctuation mark, or in any case try not to interrupt a clause.

#### 2.1.5. Quotations

Quotations that are printed in italics, without surrounding quotation marks,
should be marked up just like regular italic text (with no distinction being
made between the two). Quotations that have surrounding quotation marks should
be marked up with surrounding quotation marks. Note, however, that Markit
demands the use of the flat double quotation mark either side of the quotation
(`" ... "`), rather than the nicer-looking curly quotation marks used in the
printed texts themselves (`“ ... ”`). This is designed to save you time, since
the flat quotation mark is much easier to type on a regular keyboard. Markit
will take care of the pretty display for you.

The convention in most of our source texts is to prefix each line of an inline
quotation with an opening double quotation mark (`“`). Do not reproduce these
in the encoded version; simply include one (straight) quotation mark at the
start of the quotation, and another at the end.

Sometimes text is enclosed in quotation marks, not because it is a quotation,
but because the author wants to highlight it for one reason or another. For
example, either Hutcheson or his typesetter (I don't know which) was keen on
enclosing propositions or principles in quotation marks, rather than italicizing
them. Just as quotations in italics should be treated like any other italic
text, so emphasized text in quotation marks should be treated like any other
quotation. In other words, use underscores and quotation marks to mark up the
superficial features of the text; do not try to interpret the semantics behind
the italics or quotation marks.

Block quotations&mdash;i.e. quotations separated from the flow of the paragraph,
by being placed on a new line and indented&mdash;should be surrounded by _two_
double quotation marks: `"" ... ""`. To make the Markit file easier to read,
they should likewise be placed on a new line and indented with four spaces, like
so:

```
{#3} Few men would envy the character, which ^Caesar^ gives of ^Cassius^.
    ""He loves no play,
    As thou do'st, ^Anthony^: He hears no music:
    Seldom he smiles; and smiles in such a sort,
    As if he mock'd himself, and scorn'd his spirit
    That could be mov'd to smile at any thing.""
Not only such men, as ^Caesar^ adds, are commonly _dangerous_, but also, having
little enjoyment within themselves, they can never become agreeable to others,
or contribute to social entertainment. [...]
```

These line breaks and spaces are optional (and Markit ignores them). But they
make the text much nicer for human beings to read, as well as easier to check
against the source.

Note that there can only be _one_ line break between the block quotation and the
surrounding text in the paragraph. Consider this alternative:

```
{#3} Few men would envy the character, which ^Caesar^ gives of ^Cassius^.

    ""He loves no play,
    As thou do'st, ^Anthony^: He hears no music:
    Seldom he smiles; and smiles in such a sort,
    As if he mock'd himself, and scorn'd his spirit
    That could be mov'd to smile at any thing.""

Not only such men, as ^Caesar^ adds, are commonly _dangerous_, but also, having
little enjoyment within themselves, they can never become agreeable to others,
or contribute to social entertainment. [...]
```

The extra line breaks here may look nice, and visually correspond more closely
to the source text. However, Markit will interpret this as _three separate
paragraphs_, with the block quotation as a distinct paragraph in between the
other two. This does not reflect the intended structure of the text, which is of
a single paragraph with a block quotation inside it. Thus the first option, with
only one line break either side of the quotation, is required.

#### 2.1.6. Foreign text

Some of our source texts include words, phrases, or longer quotations in other
languages (French, Greek, or Latin). These are always italicized (at least as
far as we know; if you encounter some foreign text that is not italicized,
please let the project editor know). Instead of enclosing this text in
underscores, as with regular italic text, it should be enclosed in a pair of
dollar signs. For example:

```
Whereas perhaps that which we refuse as evil (suppose bodily or mental Pain)
though formally, and in the greatest Latitude of the Word it be an Evil, yet
comparatively and $pro hic & nunc$, it may be a Good, and so the proper Object
of our Choice.
```

Greek text is a problem, since typing Greek letters on a regular keyboard isn't
possible, and not everyone can recognize Greek letters in the first place. For
now, until we find a better solution (or some money to pay typists who can read
and write Greek), this text may be omitted. In its place, simply write `$[Greek
text]$`.

Some foreign words or word pairs have effectively been imported into English,
and should not be marked up with dollar signs. Examples include:

- a priori
- a posteriori
- ad infinitum
- etcetera
- in infinitum
- ipso facto
- viz

This list is not exhaustive. If you are unsure whether a foreign term should be
considered a part of English and not marked up with dollar signs, defer to the
project editor, and in the meantime _do not_ mark it up as foreign text.

#### 2.1.7. Footnotes

Footnotes must all be given a sequential number, starting with 1. Where
paragraph numbers reset to 1 at the start of each section of text, however,
footnote numbers should keep incrementing throughout the whole text. If the
first section of a text has three footnotes, for example, then the first
footnote in the next section will be number 4; and so on.

Footnote anchors are written, in Markit, like so: `[n9]`. Footnotes themselves
should be included at the end of the file, after the final paragraph of the main
text. Each footnote is effectively a paragraph in its own right, but its ID must
begin with the letter `n`. For example:

```
{#6} There you must excuse me, said ^Philo^: ^Leibnitz^ has denied it; and is
perhaps the first[n9], who ventured upon so bold and paradoxical an opinion; at
least, the first, who made it essential to his philosophical system.

[...]

{#n9} That sentiment had been maintained by Dr King and some few others before
^Leibniz^; though by none of so great fame as that ^German^ philosopher.
```

#### 2.1.8. Apostrophes

Apostrophes in our source texts are always nice-looking curly ones (`’`). As
with double quotation marks, however, Markit insists on plain-looking straight
ones (`'`). Again, this is to make the text easier to type, since standard
keyboards do not have a key for curly apostrophes.

#### 2.1.9. Ampersands and special characters

In XML (and consequently in TEI-XML), the ampersand (`&`) is a special character
with a particular meaning. Consequently to represent an ordinary ampersand in
TEI-XML you have to write `&amp;` instead. In Markit, however, the ampersand is
_not_ a special character, and has no special meaning. When transcribing
ampersands here, therefore, you do not need to bother with the tedious `amp;` at
the end. Markit takes care of all these awkward things for you.

(For those used to typing XML, you _may_ write `&amp;`, and Markit won't
complain. But in this context we would prefer it if you don't.)

Of course Markit does have special characters with special meanings: things like
the curly brackets used in ID tags, and the underscores and carets used to
represent italics and small capitals. For the most part, these special
characters are ones that do not show up in our source texts, causing no problem.
There is at least one exception to this rule, however, in the form of the
asterisk (`*`). The asterisk has a special meaning in Markit, being used (in the
same way as the underscore and caret) to represent bold text. As it happens,
none of our source material contains any bold text, but it does sometimes
contain asterisks.

To represent an asterisk (or any special character) in Markit, you have to
"escape" it, by prefixing it with a backslash (`\*`). This tells Markit that it
should interpret the asterisk as a literal asterisk, and not as the start of
some text in bold face. Likewise, if you want to represent a literal underscore
or caret (though this is not likely to be necessary here), you would write `\_`
or `\^`.

#### 2.1.10. Ligatures and long `s`s

Our source texts use the now old-fashioned long `s`&mdash;`ſ`&mdash;at the end of words
ending in `s`. These should be rendered here as an ordinary `s`.

Our source texts also very often include `ae` or `oe` ligatures (in words like
"phaenomenon" or "oeconomy"). These should be encoded here as separate letters,
but enclosed in curly brackets, like so: `ph{ae}nomenon`, `{oe}conomy`. Markit
will take care of the rest. If the ligature is capitalized, but both letters in
capitals: `{OE}conomy`.

#### 2.1.11. White space

With the exception of the two consecutive line breaks used to separate
paragraphs of text, Markit generally ignores white space. Single line breaks
and spaces at the beginning and end of lines can be used freely to make the text
pleasanter and easier on the human eye. This is particularly useful in block
quotations, as described above. Here is the example again (with, incidentally,
the 'ae' ligatures now marked up in Caesar's name):

```
{#3} Few men would envy the character, which ^C{ae}sar^ gives of ^Cassius^.
    ""He loves no play,
    As thou do'st, ^Anthony^: He hears no music:
    Seldom he smiles; and smiles in such a sort,
    As if he mock'd himself, and scorn'd his spirit
    That could be mov'd to smile at any thing.""
Not only such men, as ^C{ae}sar^ adds, are commonly _dangerous_, but also,
having little enjoyment within themselves, they can never become agreeable to
others, or contribute to social entertainment. [...]
```

The cost of this benefit, however, is that marking up _actual_ white space in
the source texts becomes somewhat more difficult. The example just given is in
fact incorrect (or rather incomplete). In the source text from which this
example is derived, the separate lines of the quoted poetry are printed on
separate lines. Since Markit treats single line breaks as equivalent to spaces,
however, the result of the above encoding will be a block quotation all on one
long line.

Line breaks in the source text are encoded in Markit as two forward slashes:
`//`. Thus the previous example should be encoding like this:

```
{#3} Few men would envy the character, which ^C{ae}sar^ gives of ^Cassius^.
    ""He loves no play, //
    As thou do'st, ^Anthony^: He hears no music: //
    Seldom he smiles; and smiles in such a sort, //
    As if he mock'd himself, and scorn'd his spirit //
    That could be mov'd to smile at any thing.""
Not only such men, as ^C{ae}sar^ adds, are commonly _dangerous_, but also,
having little enjoyment within themselves, they can never become agreeable to
others, or contribute to social entertainment. [...]
```

This is better, but still not quite perfect, since in the source text the first
line here begins with a block of leading white space (indicating that the
quotation begins in the middle of the line). Leading white space like this is
represented with two tildas: `~~`. (This is rendered in HTML as a tab-sized
space). In full, therefore, the markup for this passage is as follows:

```
{#3} Few men would envy the character, which ^Caesar^ gives of ^Cassius^.
    ""~~~~~~~~~~He loves no play,
    As thou do'st, ^Anthony^: He hears no music:
    Seldom he smiles; and smiles in such a sort,
    As if he mock'd himself, and scorn'd his spirit
    That could be mov'd to smile at any thing.""
Not only such men, as ^Caesar^ adds, are commonly _dangerous_, but also, having
little enjoyment within themselves, they can never become agreeable to others,
or contribute to social entertainment. [...]
```

### 2.2. Optional output

#### 2.2.1. Names

...

#### 2.2.2. Citations

...

#### 2.2.3. Editorial interventions

...

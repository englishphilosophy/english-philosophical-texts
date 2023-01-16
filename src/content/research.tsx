import React, { type FC } from "react";
import type { PageDetails } from "../types/page_details.ts";
import {
  EMPLTable,
  DissertationTable,
  emplTitles,
  dissertationTitles,
  ReligiousAuthorsTable,
  ReligiousTextsTable,
} from "./data.tsx";

/** Research page titles. */
export const researchTitles = {
  research: "Introduction",
  similarity: "Semantic Similarity",
  topics: "Topic Frequency",
};

/** Research page details. */
export const researchPages: PageDetails[] = [
  { id: "research", title: researchTitles.research, url: "/research" },
  { id: "similarity", title: researchTitles.similarity, url: "/research/similarity" },
  { id: "topics", title: researchTitles.topics, url: "/research/topics" },
];

/** Content for the main research page. */
export const Research: FC = () => (
  <div className="content">
    <h1>{researchTitles.research}</h1>
    <p>
      In addition to providing high-quality critical texts for each of the works
      listed on this site, we also plan to develop software for searching and
      analysing these texts in a variety of useful ways, and to pursue research
      illustrating the scholarly application and value of these tools. So far,
      it is possible to run complex Boolean searches in the Search area for each
      text, and to view (provisional) word usage analysis in the several
      Analysis areas. (When reading a text, select the area of interest from the
      blue dropdown menu.) Our project is still in the early stages, with many
      more features planned if we secure funding to take things further. In the
      meantime, details are available here of some preliminary tests we have run
      so far. Click on the links in the menu for more information.
    </p>
  </div>
);

/** Content for the similarity page. */
export const Similarity: FC = () => (
  <div className="content">
    <h1>{researchTitles.similarity}</h1>
    <h2>Lemmatization and TF-IDF</h2>
    <p>
      We are in the process of generating a dictionary of all the words in our
      corpus, and a function that maps all the different forms and spellings to
      a smaller number of lemmas (e.g. mapping ‘pluck’, ‘plucks’, ‘plucking’,
      ‘pluck’d’, ‘plucked’, and ‘pluck’t’ to the single lemma ‘pluck’). From
      here, we are able to calculate the{" "}
      <i>term frequency-inverse document frequency</i> of every lemma in every
      text. This standard measure from information theory multiplies the
      frequency of a term with the logarithmically scaled inverse of the number
      of documents in the corpus that contain the term. Plainly put, infrequent
      words have a low TF-IDF value, as do very frequent but very common words
      (‘a’, ‘in’, ‘the’, ‘to’, etc.); while the words that are both frequent in
      the document are rare in the corpus as a whole score highly. This provides
      a good estimate of the most important words in a text.
    </p>
    <h2>The distance between two texts</h2>
    <p>
      Various measures have been developed to estimate the semantic distance
      between two texts in a corpus, and in due course we hope to provide
      software here for calculating a number of them. A relatively simple
      measure is calcuated as follows: take the frequency of each term in the
      first text, multiply it by the TF-IDF value of that term in the second
      text, and then sum the results. Plainly put, the resulting number will be
      higher, the more the first text contains instances of the important terms
      in the second text.
    </p>
    <p>
      The most obvious use of measures like these would be to identify, when
      reading or studying one text, other related texts in our corpus that might
      be of interest. They could also be used, however, to supplement
      traditional arguments about the influence of one author on another, or the
      importance of one part of a single author’s opus in the interpretation of
      another.
    </p>
    <h2>
      Hume’s <i>Essays, Moral, Political, and Literary, Part 1</i>
    </h2>
    <p>
      The following tables show, for each of the essays in Humes{" "}
      <i>Essays, Moral, Political, and Literary, Part 1</i>, how close the other
      essays in the set are to that essay according to the measure just
      described. The closest matching pair is <i>The Platonist</i> and{" "}
      <i>The Stoic</i>. The other high matches (scores of 5 and above) are
      between the other pairs of the four essays on happiness, and for pairs of
      political essays from the first half of the collection. Numbers have been
      multiplied by 10,000 for readability.
    </p>
    <select
      data-table="empl-similarity"
      style={{ width: "100%", marginBottom: "1em" }}
    >
      {emplTitles.map((x, index) => (
        <option value={index.toString(10)}>{x}</option>
      ))}
    </select>
    <EMPLTable id={0} />
    <h2>
      Hume’s <i>Essays</i> and the <i>Four Dissertations</i>
    </h2>
    <p>
      The results of the previous test seem to confirm that the measure is
      working as intended, since related essays are indeed scoring higher
      against each other than comparatively unrelated essays. If we now run the
      same calculation with the <i>Essays</i> measured against Hume’s{" "}
      <i>Dissertation on the Passions</i>, both as a whole and against its
      individual sections, the results are potentially interesting. Most
      striking is the very high similarity between <i>Of Tragedy</i> and section
      6 of the <i>Dissertation on the Passions</i>. These two parts of Hume’s
      opus were originally side by side in his <i>Four Dissertations</i> of
      1757, but he separated them soon after (for the 1758 edition of his{" "}
      <i>Essays and Treatises</i>). The results here suggest that separation may
      have been unfortunate.
    </p>
    <select
      data-table="dissertation-similarity"
      style={{ width: "100%", marginBottom: "1em" }}
    >
      {dissertationTitles.map((x, index) => (
        <option value={index.toString(10)}>{x}</option>
      ))}
    </select>
    <DissertationTable id={0} />
  </div>
);

/** Content for the topics page. */
export const Topics: FC = () => (
  <div className="content">
    <h1>{researchTitles.topics}</h1>
    <h2>Topics</h2>
    <p>
      It has been suggested that women philosophers of the early modern period
      were more interested in religion than men. How might one assess this
      hypothesis? In the absence of a computer and a large digital corpus, there
      is not much to be done besides reading widely, and forming an impression
      as best one can. With the tools we plan to develop here, however, it will
      be possible to take some more objective measurements.
    </p>
    <p>
      For the purposes of computation, we can define a <i>topic</i> to be a set
      of words and phrases, each with a positive numeric weighting. We can then
      measure the extent to which a given work is concerned with this topic by
      taking the relative frequency of each of these words and phrases in the
      work, multiplying it by its weighting, and summing the result. In due
      course we intend to allow users of this site to create arbitrary topics of
      this kind, and assess how concerned with that topic any given work is,
      according to this measure.
    </p>
    <h2>Modelling religion</h2>
    <p>
      The software we have developed so far does not yet allow for multi-word
      phrases. For illustrative purposes, we have created a relatively crude
      topic to represent relgion, consisiting of thirty words of equal
      weighting: ‘atheism’, ‘atheist’, ‘christ’, ‘christian’, ‘christianity’,
      ‘cosmogony’, ‘deity’, ‘divine’, ‘divinity’, ‘eternal’, ‘eternity’, ‘god’,
      ‘gospel’, ‘messiah’, ‘miracle’, ‘miraculous’, ‘prophecy’, ‘prophet’,
      ‘providence’, ‘religion’, ‘religious’, ‘revelation’, ‘scripture’, ‘sin’,
      ‘soul’, ‘temptation’, ‘theism’, ‘theist’, ‘theological’, and ‘theology’.
      We then calculated how ‘religious’ each author and work in our corpus is,
      as measured against this model. The results are shown below. The data so
      far are inconclusive. We hope to be able to deliver some interesting
      results when we have more texts and more refined measurements.
    </p>
    <p>
      Some general comments about the results are in order. First, that Norris
      should presently top the list of religious authors, while not itself an
      implausible result, is explained in large part by the fact that the
      high-scoring <i>Letters Concerning the Love of God</i> is the only work of
      his we yet have in our corpus. Conway comes second for a similar reason;
      the <i>Principles of the Most Ancient and Modern Philosophy</i>, number 4
      on the list of most religious works, is her only published work. That Hume
      should be second to last is obviously wildly off key, but there is a very
      simple reason for this: although he wrote a lot about religion (including
      the most religious work by this measure), he also wrote a lot of other
      things, including an enormous <i>History of England</i> (which is an order
      of magnitude larger than any other work we currently have in our corpus).
      The sheer size of his opus thus drags his average down.
    </p>
    <p>
      In general, because this measure is based on <em>relative</em> word
      frequencies, there is a bias in favour of shorter texts and authors who
      wrote less (or for whom we do not yet have so many works in our corpus).
      Taking <em>absolute</em> word frequencies instead would not solve this
      problem, but simply result in the opposite bias. There are better ways to
      account for things like these, which we intend to incorporate into our
      software over the coming years.
    </p>
    <h2>Religious authors</h2>
    <ReligiousAuthorsTable />
    <h2>Religious texts</h2>
    <ReligiousTextsTable />
  </div>
);

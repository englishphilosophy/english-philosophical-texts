import * as colours from '../colours.ts'
import * as fonts from '../fonts.ts'

export default `
.blocks {
  margin: 1em;
}

.block {
  padding-top: 3em;
  margin: -3em 0 1em;
}

.block .id {
  color: ${colours.blue};
  text-align: right;
  margin-bottom: .5em;
}

.block .content {
  font-family: ${fonts.old};
  font-size: 1.375em;
  text-align: justify;
}

.block .content h1,
.block .content h2,
.block .content h3,
.block .content h4,
.block .content h5,
.block .content h6 {
  font-weight: normal;
  text-align: center;
  line-height: 1.25;
}

.block .content .page-break {
  display: none;
}

.block .content .small-capitals {
  font-family: ${fonts.oldSC};
  font-style: normal;
}

.block .content .name {
  text-decoration: underline;
}

.block .content .foreign {
  font-style: italic;
}

.block .content .margin-comment {
  float: right;
  background: ${colours.beige};
  font-size: .875em;
  line-height: 1.6;
  text-align: right;
  padding: 0 .25em;
  margin-left: 1em;
  max-width: 10em;
}

.block .content del {
  display: none;
}

.block .content ins {
  text-decoration: none;
}
`

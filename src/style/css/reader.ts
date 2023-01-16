import * as colours from '../colours.ts'

export default `
.reader {
  padding: .5em 0;
  display: grid;
  grid-gap: 1em;
}

.reader .section {
  border: 1px solid ${colours.gray};
  background: #fff;
  max-width: 40em;
  margin: 0 auto;
}

.reader .section-menu {
  width: 100%;
  background: ${colours.blue};
  color: ${colours.white};
  border: 0;
}

@media (min-width: 79rem) {
  .reader {
    grid-template-columns: 1fr 1fr;
  }
}
`

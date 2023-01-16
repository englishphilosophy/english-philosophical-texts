import * as colours from '../colours.ts'

export default `
.controls {
  margin: 0 auto;
  width: 100%;
  max-width: 83em;
  background: ${colours.transblack};
  display: grid;
  grid-gap: .5em;
  grid-template-columns: 1fr;
  padding: .5em;
}

@media (min-width: 34rem) {
  .controls {
    grid-template-columns: 1fr auto;
  }
}

@media (min-width: 59rem) {
  .controls {
    padding: 1em;
  }
}
`

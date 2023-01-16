import * as colours from '../colours.ts'

export default `
.library {
  border-top: 0;
  display: grid;
  grid-gap: .5em;
}

.library .author {
  display: block;
  padding: .5em;
  background: #fff;
  border: 1px solid ${colours.gray};
  transition: .3s ease-in-out;
  color: inherit;
}

.library .author:hover {
  cursor: pointer;
  text-decoration: none;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.25);
}

.library .author h6 {
  margin-bottom: .5em;
  color: ${colours.blue};
}

@media (min-width: 34em) {
  .library .author {
    display: flex;
  }

  .library .author h6 {
    flex: 1;
    padding-right: .5em;
  }

  .library .author .details {
    flex-basis: 13em;
  }
}

@media (min-width: 64rem) {
  .library {
    grid-template-columns: 1fr 1fr;
  }
}
`

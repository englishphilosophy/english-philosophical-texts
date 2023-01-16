import * as colours from '../colours.ts'

export default `
.search {
  margin: 1em;
}

.search-form {
  margin-bottom: 1em;
}

.search-form .group:not(:last-child) {
  margin-bottom: 1em;
}

.search-form .group.buttons {
  display: flex;
  justify-content: flex-end;
}

.search-form .group label {
  margin-bottom: .25em;
}

.search-form .group .inputs {
  display: flex;
}

.search-form .group .inputs input {
  flex: 1;
}

.search-form .group .inputs select {
  margin: 0 .5em;
}

.search-form .group .inputs.checkboxes {
  display: flex;
  justify-content: space-between;
  border: 2px solid ${colours.gray};
}

.search-form .group .inputs.checkboxes label {
  padding: .25em .5em;
  margin-bottom: 0;
}

.results {
  padding: .5em 0;
  border-bottom: 1px solid ${colours.gray};
  border-top: 1px solid ${colours.gray};
}

.results.hidden {
  display: none;
}

.results .title {
  margin-bottom: 0;
}

.results .total {
  text-align: right;
  color: ${colours.blue};
  cursor: pointer;
  padding: .25em 0;
  margin: 0;
}

.results .total:hover {
  background: ${colours.lightgray};
}

.results .results {
  display: none;
}

.results .results.active {
  display: block;
  padding: .5em 0;
}
`

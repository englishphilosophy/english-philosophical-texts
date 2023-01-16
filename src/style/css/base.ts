import * as colours from '../colours.ts'

export default `
* {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0 0 1rem;
  font-weight: 600;
}

h1 {
  font-size: 1.625em;
}

h2 {
  font-size: 1.5em;
}

h3 {
  font-size: 1.375em;
}

h4 {
  font-size: 1.25em;
}

h5 {
  font-size: 1.125em;
}

h6 {
  font-size: 1em;
}

p {
  margin: 0 0 1em;
}

input[type="text"], select {
  background: #fff;
  padding: .25em .5em;
  height: 2.5em;
  font: inherit;
  border: 2px solid ${colours.gray};
  outline: none;
  transition: .3s;
}

input:focus, select:focus {
  border-color: ${colours.blue};
}

label {
  cursor: pointer;
  display: block;
}

button {
  font: inherit;
  border: 0;
  outline: 0;
  padding: .5em 1em;
  height: 2.5em;
  background: ${colours.blue};
  color: #fff;
  cursor: pointer;
}

a {
  color: ${colours.blue};
  cursor: pointer;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

b {
  font-weight: 600;
}

mark {
  background: ${colours.beige};
}

table {
  border-collapse: collapse;
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1em;
}

thead tr {
  background: ${colours.lightgray};
}

tbody tr {
  border-top: 1px solid ${colours.darkgray};
}

th {
  text-align: left;
  font-weight: 600;
}

th, td {
  vertical-align: top;
  padding: .25em .5em;
}
`

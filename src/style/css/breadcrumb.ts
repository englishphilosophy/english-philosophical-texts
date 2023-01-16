import * as colours from '../colours.ts'

export default `
.breadcrumb {
  background: ${colours.transblack};
  padding: .5em;
  color: ${colours.white};
  display: flex;
  flex-wrap: wrap;
}

.breadcrumb a {
  display: inline-block;
  padding: .25em .5em;
  white-space: nowrap;
  color: inherit;
}

.trail {
  flex: 1;
  display: flex;
}

.trail .crumb {
  white-space: nowrap;
}

.trail .crumb:not(:last-child)::after {
  padding: 0 .25em;
  content: "/";
}

.context {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
`

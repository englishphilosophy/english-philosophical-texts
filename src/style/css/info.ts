import * as colours from '../colours.ts'

export default `
.info {
}

.info select.submenu {
  width: 100%;
  margin-bottom: .5em;
}

.info nav.submenu {
  display: none;
}

.info .content {
  background: #fff;
  border: 1px solid ${colours.gray};
  padding: 1em;
}

.info .content blockquote {
  margin: 0;
}

.info .content cite {
  display: block;
  text-align: right;
  margin-top: .25em;
  margin-bottom: 1.5em;
  color: ${colours.blue};
}

@media (min-width: 58rem) {
  .info .content {
    padding: 1em 2em;
  }
}

@media (min-width: 64rem) {
  .info {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 1em;
  }

  .info select.submenu {
    display: none;
  }

  .info nav.submenu {
    display: block;
    min-width: 18em;
  }

  .info nav.submenu div {
    background: #fff;
    border: 1px solid ${colours.gray};
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 5em;
    padding: 1em;
  }

  .info nav.submenu a {
    padding: .25em .5em;
  }

  .info nav.submenu a:not(:last-child) {
    margin-bottom: .5em;
  }

  .info nav.submenu a:hover,
  .info nav.submenu a.active {
    background: ${colours.blue};
    color: ${colours.white};
    text-decoration: none;
  }
}
`

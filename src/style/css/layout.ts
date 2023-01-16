import * as colours from '../colours.ts'
import * as fonts from '../fonts.ts'
import * as images from '../images.ts'

export default `
html {
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  min-height: 100vh;
}

body {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: ${fonts.sans};
  line-height: 1.5;
  background: ${colours.white};
  color: ${colours.black};
}

header {
  background: ${colours.blue};
}

header hgroup {
  font-family: ${fonts.old};
  color: ${colours.white};
  padding: .5em;
  line-height: 1;
  text-align: center;
}

header h1, header h2 {
  font-weight: normal;
  margin: 0;
}

header h1 {
  margin-bottom: .5rem;
}

header h2 {
  font-style: italic;
}

header nav {
  display: flex;
  justify-content: center;
  margin-bottom: .5em;
}

header nav a {
  color: ${colours.white};
  padding: .25em .5em;
  margin: 0 .5em;
  border-bottom: 3px solid transparent;
  transition: .3s;
}

header nav a:hover, header nav a.active {
  border-color: ${colours.beige};
  text-decoration: none;
}

body > nav {
  background-image: url('${images.leviathan}');
  background-size: cover;
  background-position: center;
  position: sticky;
  top: 0;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.25);
}

body > nav hgroup {
  background: ${colours.transblack};
  color: ${colours.white};
}

body > nav hgroup h1 {
  max-width: 83em;
  margin: 0 auto;
  padding: 1rem;
  font-size: 1.37em;
}

section {
  width: 100%;
  max-width: 83em;
  margin: 0 auto;
}

main {
  padding-bottom: 3em;
}

main section {
  padding: .5em;
}

footer {
  background: ${colours.black};
  color: ${colours.white};
  padding-top: 2em;
}

footer section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1em;
}

footer p {
  flex-basis: 38em;
}

footer ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

footer a {
  color: ${colours.beige};
}

@media (min-width: 59rem) {
  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  header hgroup {
    padding: 1em;
    text-align: left;
  }

  header nav {
    padding: 1em;
    margin-bottom: 0
  }

  body.home > nav {
    padding: 10em 1em 1em;
    position: initial;
  }

  main section {
    padding: 1em;
  }

  footer {
    padding-top: 6em;
  }
}

@media (min-width: 62rem) {
  footer section {
    padding: 2em 3em;
  }
}
`

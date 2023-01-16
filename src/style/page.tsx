import React, { type FC, type PropsWithChildren } from "react";
import type { PageOptions } from "../types/page_options.ts";
import css from "./css.ts";

const Page: FC<PropsWithChildren<PageOptions>> = ({
  title,
  section,
  bodyClass,
  nav,
  children,
}) => {
  const displayTitle = title
    ? `${title} - English Philosophical Texts Online`
    : "English Philosophical Texts Online";

  return (
    <html lang="en">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta http-equiv="Content-Type|" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="english, philosophy, texts, hobbes, locke, hume, mill, shaftesbury"
        />
        <meta
          name="description"
          content="High-quality digital editions of a broad canon of English philosophical texts published between 1650 and 1830."
        />
        <title>{displayTitle}</title>
        <style type="text/css" dangerouslySetInnerHTML={{ __html: css }} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          async={true}
          src="https://www.googletagmanager.com/gtag/js?id=UA-23731986-3"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-23731986-3');",
          }}
        />
        <script defer={true} type="module" src="/js/app.js" />
      </head>
      <body className={bodyClass}>
        <header>
          <hgroup>
            <h1>English Philosophical Texts Online</h1>
            <h2>
              A free online library of early modern English-language
              philosophical texts
            </h2>
          </hgroup>
          <nav>
            <a href="/" className={section === "Texts" ? "active" : undefined}>
              Texts
            </a>
            <a
              href="/research"
              className={section === "Research" ? "active" : undefined}
            >
              Research
            </a>
            <a
              href="/about"
              className={section === "About" ? "active" : undefined}
            >
              About
            </a>
          </nav>
        </header>
        {nav ? <nav>{nav}</nav> : null}
        <main>
          <section>{children}</section>
        </main>
        <footer>
          <section>
            <p>
              English Philosophical Texts Online is developed and maintained by{" "}
              <a href="https://merivale.uk">Amyas Merivale</a>, as part of a
              project run by <a href="">Amyas Merivale</a> and{" "}
              <a href="http://www.millican.org">Peter Millican</a> at the{" "}
              <a href="https://www.philosophy.ox.ac.uk">University of Oxford</a>
              . All comments and suggestions are welcome.
            </p>
            <ul>
              <li>
                <a href="https://englishphilosophy.org">
                  English Philosophical Texts Online
                </a>
              </li>
              <li>
                <a href="https://davidhume.org">Hume Texts Online</a>
              </li>
              <li>
                <a href="https://github.com/englishphilosophy">
                  Early English Philosophy @ GitHub
                </a>
              </li>
            </ul>
          </section>
        </footer>
      </body>
    </html>
  );
};

export default Page;

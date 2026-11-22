import { useEffect, useState } from 'react';
import { Canvas } from '../components/Canvas';
import { Art } from '../components/Art';
import { Text } from '../components/Text';
import { HomeMark, RoughFilter } from '../components/HomeMark';
import { useReveal } from '../components/Reveal';
import Footer from '../sections/Footer';
import { img } from '../assets';
import { links } from '../links';
import { fetchBooks, groupByYear, SHEET_URL, type Book } from './booklog-data';
import './LibraryPage.css';

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; books: Book[] };

const pad = (n: number) => String(n).padStart(2, '0');
/** Negative years in the sheet are BCE (the Aeneid is "-19"). */
const year = (y: string) => (/^-\d+$/.test(y) ? `${y.slice(1)} bce` : y);

/**
 * The booklog ("my library"), restyled to match the portfolio: the header
 * echoes the Project Page ("what i've been / reading..."), the ledger uses
 * the site's type and colours. Books come live from the published Google
 * Sheet, so editing the sheet updates the page.
 */
export default function LibraryPage() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    const ctrl = new AbortController();
    fetchBooks(ctrl.signal)
      .then((books) => setState({ status: 'ready', books }))
      .catch((e) => {
        if (!ctrl.signal.aborted) {
          console.warn('booklog: could not load the sheet', e);
          setState({ status: 'error' });
        }
      });
    return () => ctrl.abort();
  }, []);

  useReveal(state.status === 'ready');

  const books = state.status === 'ready' ? state.books : [];
  const groups = groupByYear(books);

  let n = 0;
  return (
    <div className="page page--library">
      <HomeMark />

      <Canvas as="header" size={[2005, 820]} mobileSize={[900, 700]} className="lib-head">
        <Art {...img.heroTexture} alt="" box={[-23, -569, 1145, 2036]} mobile={[-23, -300, 700, 1245]} />
        <nav aria-label="Primary" className="lib-nav">
          <Text as="a" href={links.projects} box={[1700, 20, 110]} mobile={[560, 30, 140]} variant="note" color="frost" nowrap>
            projects
          </Text>
          <Text as="a" href={links.writings} box={[1845, 20, 110]} mobile={[730, 30, 140]} variant="note" color="frost" nowrap>
            writings
          </Text>
        </nav>

        <RoughFilter />
        <h1 className="lib-title">
          <Text as="span" box={[77, 225, 909]} mobile={[48, 250, 800]} variant="title" color="moonshine" nowrap>
            what i’ve been
          </Text>
          <Text as="span" box={[413, 234, 1227, 346]} mobile={[100, 330, 760, 216]} variant="display" color="ice" nowrap>
            reading...
          </Text>
        </h1>

        {/* The "my library" jellyfish from the homepage hero, drifting. */}
        <Art {...img.fiveJellyfish2} alt="" box={[1620, 290, 330, 264]} mobile={[640, 120, 200, 160]} fit="fill" className="lib-jelly" priority />
      </Canvas>

      <main className="lib-ledger" aria-live="polite" aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && <p className="lib-status">fetching records…</p>}
        {state.status === 'error' && (
          <p className="lib-status">
            the records could not be fetched just now — <a href={SHEET_URL}>open the full sheet</a>.
          </p>
        )}

        {groups.map((g, gi) => (
          <section key={g.year} className="lib-year reveal" aria-labelledby={`year-${g.year}`}>
            <div className="lib-year__head">
              <img className="lib-year__lotus" src={img.whiteLotus.src} alt="" width={img.whiteLotus.intrinsic[0]} height={img.whiteLotus.intrinsic[1]} loading="lazy" />
              <h2 id={`year-${g.year}`} className="lib-year__title">
                {g.year}
              </h2>
              <p className="lib-year__count">
                {pad(g.books.length)} {g.books.length === 1 ? 'book' : 'books'}
              </p>
            </div>

            <table className="lib-table">
              <thead className={gi === 0 ? undefined : 'visually-hidden'}>
                <tr>
                  <th scope="col">no.</th>
                  <th scope="col">title</th>
                  <th scope="col">author</th>
                  <th scope="col">pub.</th>
                  <th scope="col">read</th>
                  <th scope="col">copy</th>
                </tr>
              </thead>
              <tbody>
                {g.books.map((b) => {
                  n += 1;
                  return (
                    <tr key={`${n}-${b.title}`}>
                      <td className="lib-no">{pad(n)}</td>
                      <td className="lib-book">
                        <cite>{b.title}</cite>
                      </td>
                      <td className="lib-author">{b.author}</td>
                      <td className="lib-pub">{b.pub ? year(b.pub) : '—'}</td>
                      <td className="lib-read">
                        {b.pct == null ? (
                          '—'
                        ) : (
                          <>
                            <span className={b.pct >= 100 ? 'lib-bar lib-bar--done' : 'lib-bar'} aria-hidden="true">
                              <span style={{ width: `${b.pct}%` }} />
                            </span>
                            <span className="lib-pct">{Math.round(b.pct)}%</span>
                          </>
                        )}
                      </td>
                      <td className={b.mode === 'ebook' ? 'lib-copy lib-copy--ebook' : 'lib-copy'}>{b.mode || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ))}

        {state.status === 'ready' && (
          <p className="lib-sheet reveal">
            <a href={SHEET_URL} target="_blank" rel="noopener">
              → see the full sheet
            </a>
          </p>
        )}
      </main>

      <Footer home="./" />
    </div>
  );
}

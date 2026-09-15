/* Home skeleton: headline, chip row, five ranking rows. Lives in the (home) group so only the home page streams behind a boundary; every other page renders whole, so a notFound() there still returns a real 404. */
export default function Loading() {
  return (
    <main className="container" aria-busy="true">
      <section className="hero"><div className="sk sk--h1" /></section>
      <div className="layout">
        <div>
          <div className="sk-row" style={{ gap: 6, marginBottom: 16 }}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="sk sk--chip" />)}</div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="sk-item">
              <div className="sk sk--thumb" />
              <div><div className="sk sk--line" style={{ width: "32%" }} /><div className="sk sk--line" style={{ width: "58%" }} /><div className="sk sk--line sk--thin" style={{ width: "40%" }} /></div>
              <div className="sk-row">{[0, 1, 2].map((j) => <div key={j} className="sk sk--count" />)}</div>
            </div>
          ))}
        </div>
        <aside className="side"><section><div className="sk sk--line" style={{ width: "40%" }} />{[0, 1, 2, 3, 4].map((i) => <div key={i} className="sk sk--line sk--thin" />)}</section></aside>
      </div>
    </main>
  );
}

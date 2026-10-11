import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";

// Starter copy — have counsel review before launch.
const PAGES = {
  privacy: {
    title: "Privacy Policy",
    note: "Last updated October 11, 2026",
    sections: [
      {
        h: "What we collect",
        p: [
          "This page doesn't ask for or store any personal information while crescent.ai is pre-launch.",
        ],
      },
      {
        h: "Your choices",
        p: ["Questions about your data? Write to [contact email] and we'll reply promptly."],
      },
      {
        h: "Changes to this policy",
        p: [
          "When crescent.ai launches this policy will be updated, and we'll change the date at the top of this page.",
        ],
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    note: "This statement was last updated on October 11, 2026.",
    sections: [
      {
        h: "Our commitment",
        p: ["We're working to make crescent.ai usable by people with disabilities."],
      },
      {
        h: "What we've done",
        p: [
          "We've built this site to meet WCAG 2.1 level AA, including:",
          [
            "Semantic headings and landmarks for screen readers",
            "Controls you can reach and use with a keyboard, with visible focus",
            "Text and interface colors that meet contrast requirements",
            "Reduced motion: the animated headline stays still if your system asks for less motion",
          ],
        ],
      },
      {
        h: "Feedback",
        p: [
          "If you hit an accessibility barrier on this site, or need information in another format, contact us at [contact email].",
        ],
      },
    ],
  },
};

export default function Legal({ page }) {
  const { title, note, sections } = PAGES[page];

  return (
    <div className="legal">
      <header className="legal__head">
        <Logo />
      </header>

      <main className="legal__body">
        <p className="legal__kicker">Legal</p>
        <h1>{title}</h1>
        <p className="legal__note">{note}</p>
        <hr />
        {sections.map(({ h, p }) => (
          <section key={h}>
            <h2>{h}</h2>
            {p.map((block, i) =>
              Array.isArray(block) ? (
                <ul key={i}>
                  {block.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              ) : (
                <p key={i}>{block}</p>
              )
            )}
          </section>
        ))}
      </main>

      <footer className="legal__foot">
        <nav>
          <Link to="/privacy">Privacy</Link>
          <Link to="/accessibility">Accessibility</Link>
        </nav>
        <small>© {new Date().getFullYear()} crescent.ai</small>
      </footer>
    </div>
  );
}

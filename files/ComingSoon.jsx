import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import LineField from "../components/LineField.jsx";

const HEADLINE = ["COMING", "SOON"];

export default function ComingSoon() {
  return (
    <main className="stage">
      <div className="field">
        <header className="field__head">
          <Logo />
        </header>
        <h1 className="sr-only">Coming soon</h1>
        <LineField lines={HEADLINE} />
        <footer className="field__foot">
          <nav>
            <Link to="/privacy">Privacy</Link>
            <Link to="/accessibility">Accessibility</Link>
          </nav>
          <small>© {new Date().getFullYear()} crescent.ai</small>
        </footer>
      </div>
    </main>
  );
}

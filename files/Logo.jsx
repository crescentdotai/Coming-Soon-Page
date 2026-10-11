import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="crescent.ai home">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <defs>
          <clipPath id="logo-clip">
            <circle cx="11" cy="11" r="10" />
          </clipPath>
        </defs>
        <g clipPath="url(#logo-clip)" fill="currentColor">
          {[1, 4.6, 8.2, 11.8, 15.4, 19].map((y) => (
            <rect key={y} x="0" y={y} width="22" height="2.4" />
          ))}
        </g>
      </svg>
      <span>CRESCENT.AI</span>
    </Link>
  );
}

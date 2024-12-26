import { useState } from "react";

export function NavigationBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <SearchBar />
      {children}
    </nav>
  );
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Popcorn Time </h1>
    </div>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export function FoundResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

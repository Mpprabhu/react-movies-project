import { useState, useEffect } from "react";
import { KEY, URL } from "../config";

export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          // RESPONSE
          const response = await fetch(`${URL}apikey=${KEY}&s=${query}`, {
            signal: controller.signal,
          });

          if (!response.ok) throw new Error("Something Went Wrong :(");

          // DATA
          const data = await response.json();

          if (data.Response === "False") throw new Error("Movie Not Found!!");

          setMovies(data.Search);
          setError("");

          return function () {
            controller.abort();
          };
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return { movies, isLoading, error };
}

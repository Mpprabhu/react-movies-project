import { useEffect, useState } from "react";
import { KEY, URL } from "../config";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "../Hooks/useKey";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Actors: actors,
    Runtime: runtime,
    Poster: poster,
    imdbRating,
    Director: director,
    Plot: plot,
    Released: released,
    Language: language,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      title,
      poster,
      year,
      userRating,
      imdbId: selectedId,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // KEYPRESS EVENTS
  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const response = await fetch(`${URL}apikey=${KEY}&i=${selectedId}`);
        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;

      return () => (document.title = `Popcorn Time`);
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to Watchlist
                    </button>
                  )}
                </>
              ) : (
                <p style={{ textAlign: "center", fontSize: "1.5rem" }}>
                  <em>You Rated this Movie</em> ⭐ {watchedUserRating}
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring : {actors}</p>
            <p>Directed By {director}</p>
            <p>Languages : {language}</p>
          </section>
        </>
      )}
    </div>
  );
}

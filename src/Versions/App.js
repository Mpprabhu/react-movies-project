import { useState } from "react";
import {
  NavigationBar,
  FoundResult,
  SearchBar,
} from "../Components/NavigationBar";
import Main from "../Components/Main";
import Box from "../Components/Box";
import MovieDetails from "../Components/MovieDetails";
import { MovieList, ErrorMessage } from "../Components/MoviesList";
import Loader from "../Components/Loader";
import { WatchedMovieList, WatchedSummary } from "../Components/WatchedMovies";
import { useMovie } from "../Hooks/useMovie";
import { useLocalStorageState } from "../Hooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovie(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  // HANDLER FUNCTIONS----------------------------------------------
  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
  }

  // EFFECTS.....................................

  return (
    <>
      <NavigationBar>
        <SearchBar query={query} setQuery={setQuery} />
        <FoundResult movies={movies} />
      </NavigationBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

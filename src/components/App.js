import { useEffect, useState } from "react";
import { NavBar } from "./Navbar/NavBar";
import { Main } from "./Main/Main";
import { Logo } from "./Navbar/Logo";
import { SearchBar } from "./Navbar/SearchBar";
import { SearchResultCount } from "./Navbar/SearchResultCount";
import { Box } from "./Main/MovieList/Box";
import { MovieSummary } from "./Main/MoviesSummary/MovieSummary";
import { MoviesToSee } from "./Main/MovieList/MovieToSee";
import { WatchedMoviesList } from "./Main/MovieList/WatchedMoviesList";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

export const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "121f5573";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMssg, setErrMssg] = useState("");
  useEffect(
    function () {
      async function fetchMovies() {
        if (!query) {
          return;
        }
        try {
          setIsLoading(true);
          setErrMssg("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok) {
            console.log("res ok not running");
            throw new Error(`Error Fetching Details`);
          }

          const movies = await res.json();

          if (movies.Response === "True") {
            setMovies(movies.Search);
          } else {
            throw new Error("Movies not found");
          }
        } catch (err) {
          setErrMssg(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <SearchResultCount movies={movies} />
      </NavBar>

      <Main>
        <Box movies={movies} isOpen={isOpen1} setIsOpen={setIsOpen1}>
          {isLoading && <Loader />}
          {!isLoading && !errMssg && <MoviesToSee movies={movies} />}
          {errMssg && <ErrorMssg message={errMssg} />}
        </Box>
        <Box isOpen={isOpen2} setIsOpen={setIsOpen2}>
          <MovieSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMssg({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

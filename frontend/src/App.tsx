import { SetStateAction, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.scss";
import api from "./api";
import Pagination from "./components/Pagination";

type Film = {
  title: string;
  description: string;
  director: string;
  producer: string;
  banner: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
  const [count, setCount] = useState(0);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const getFilms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/films", {
        params: {
          page: currentPage,
        },
      });
      setTotalCount(response.data.totalCount);

      return response.data.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFilms().then((films) => setFilms(films));
  }, [currentPage]);

  const refreshFilms = async () => {
    setLoading(true);
    try {
      await api.get("films/refresh");

      const films = await getFilms();
      setFilms(films);

      // await wait(5000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <button disabled={loading} onClick={async () => await refreshFilms()}>
        Refresh
      </button>
      <Pagination
        onPageChange={(page) => setCurrentPage(page)}
        totalCount={totalCount}
        currentPage={currentPage}
      />
      <div className="films-container">
        {!loading && films.length > 0 ? (
          films.map((film) => (
            <div key={film.title} className="film-card">
              <img src={film.banner} alt={film.title} />
              <h2>{film.title}</h2>
              <h3>
                <small>Director:</small> {film.director}
              </h3>
              <h3>
                <small>Producer:</small> {film.producer}
              </h3>
              <p>{film.description}</p>
            </div>
          ))
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
}

export default App;

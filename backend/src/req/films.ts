import axios from "axios";

type Film = {
  id: string;
  title: string;
  description: string;
  director: string;
  producer: string;
};

export const getFilmBanner = async (id: string) => {
  const res = await axios.get<{
    movie_banner: string;
  }>(`https://ghibliapi.herokuapp.com/films/${id}`);

  return res.data.movie_banner;
};

export const getFilms = async () => {
  const res = await axios.get<Film[]>("https://ghibliapi.herokuapp.com/films");

  const films = res.data.map(async (film) => ({
    title: film.title,
    description: film.description,
    director: film.director,
    producer: film.producer,
    banner: await getFilmBanner(film.id),
  }));

  return Promise.all(films);
};

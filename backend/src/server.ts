import express from "express";
import { getFilms } from "./req/films";

import { PrismaClient } from "@prisma/client";
import cors from "cors";

const server = express();
const prisma = new PrismaClient();

server.use(cors());
server.use(express.json());

type FilmsQuery = {
  page: number;
};

server.get("/films", async (req, res) => {
  const query = req.query;

  const page = query.page ? Number(query.page as string) : 1;

  const startIndex = (page - 1) * 10;
  const endIndex = page * 10;

  const totalCount = await prisma.film.count();
  const totalPages = Math.ceil(totalCount / 10);

  const results = {
    data: [],
    totalCount: totalCount,
    totalPages: totalPages,
    currentPage: page,
    next: {
      page: page !== totalPages ? page + 1 : null,
    },
  };

  try {
    if (page < 0) {
      return res.status(400).json({
        message: "Invalid page number, should start with 1",
      });
    } else if (page === 1 || endIndex <= totalCount || page === totalPages) {
      results.data = (await prisma.film.findMany({
        take: 10,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
        select: {
          id: false,
          title: true,
          description: true,
          director: true,
          producer: true,
          banner: true,
        },
      })) as never[];

      return res.status(200).json(results);
    } else {
      return res.status(404).json({
        error: "Resource not found",
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
});

server.get("/films/refresh", async (req, res) => {
  const films = await getFilms();

  films.map(async (film) => {
    await prisma.film.upsert({
      where: { title: film.title },
      update: { ...film },
      create: { ...film },
    });
  });

  // createMany no working in sqlite
  // await prisma.films.createMany({
  //   data: films,
  //   skipDuplicates: true,
  // })

  res.send({
    message: "Films refreshed",
  });
});

export default server;

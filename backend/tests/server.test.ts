import { test, expect } from "vitest";
import req from "supertest";

import server from "../src/server";

test("[GET] / 200", async () => {
  const res = await req(server).get("/");
  expect(res.status).toBe(200);
});

test("[GET] /", async () => {
  const res = await req(server).get("/");
  expect(res.text).toBe("Hello World!");
});

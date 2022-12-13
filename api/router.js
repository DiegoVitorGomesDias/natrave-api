import Router from "@koa/router";

import * as users from "./users/index.js";
import * as hunches from "./hunches/index.js";
import * as games from "./games/index.js";

export const router = new Router();

router.get("/", (ctx) => ctx.body = "Bem Vindo");

router.get("/login", users.login);
router.get("/users", users.getUsers);
router.post("/users", users.createUser);
router.delete("/users", users.deleteUser);

router.get("/hunches", hunches.getHunches);
router.post("/hunches", hunches.createHunch);
router.delete("/hunches", hunches.deleteHunch);

router.get("/games", games.getGames);

router.get("/:username", hunches.getHunchesFromUser);
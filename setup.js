import Koa from "koa";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";

import { router } from "./router.js";

export const app = new Koa();

app.use(cors());
app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());
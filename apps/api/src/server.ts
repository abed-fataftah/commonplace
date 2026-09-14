import { APP_NAME, type Health } from "@commonplace/shared";

const health: Health = { status: "ok", uptime: process.uptime() };

console.log(APP_NAME, health);

import { errorResponse } from "../src/serve/response.ts";
import router from "../src/serve/router.ts";

const port = 3001;
Deno.serve({ port, onError: errorResponse }, router);

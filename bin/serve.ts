import { serve } from "http";
import router from "../src/serve/router.ts";
import { errorResponse } from "../src/serve/response.ts";

const port = 3001;
serve(router, { port, onError: errorResponse });

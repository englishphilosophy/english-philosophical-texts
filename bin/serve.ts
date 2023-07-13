import { serve } from "http";
import router from "../src/router.ts";
import { errorResponse } from "../src/response.ts";

const port = 3001;
serve(router, { port, onError: errorResponse });

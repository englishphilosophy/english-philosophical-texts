import { Server } from "http"
import handler from "../src/server/router.tsx"
import { error as onError } from "../src/server/handler.tsx"

const port = 3001
const app = new Server({ port, handler, onError })
app.listenAndServe()

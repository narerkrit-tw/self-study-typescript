import * as express from "express"
import { Request, Response } from "express"
import * as expressWs from "express-ws"
import SampleRouter from "./SampleRouter"

import { TestRouter } from "./util/Types"


const {app, getWss, applyTo } = expressWs(express())

const httpPort = 8080

app.use(express.json())

const router1 = express.Router() as expressWs.Router

router1.ws("/echo", (ws, req) => {
  ws.on("message", (msg: string) => {
    ws.send(`got message: ${msg}`)
  })
})

app.use("/ws-stuff", router1)

const router2 = express.Router()

router2.get("/hi", (req: Request, resp: Response) => {
  console.log("got request")
  resp.status(200).send( "hello")
})

app.use("/api", TestRouter)

console.log(`starting server on port ${httpPort}`)


app.listen(httpPort)
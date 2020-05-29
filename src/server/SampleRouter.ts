import * as express from "express"
import * as T from "io-ts"
import { optionFromNullable as TOpt } from "io-ts-types/lib/optionFromNullable"
import RestypedRouter from "restyped-express-async"

const SampleReq = T.type({
    someNumber: T.number,
    optionalBoolean: TOpt(T.boolean)
})

type SampleReq = T.TypeOf<typeof SampleReq>

type SampleAPI = {
  "/sample": {
    POST: {
      body: SampleReq
    }
  }
}

const apiRouter = express.Router()
const router = RestypedRouter<SampleAPI>(apiRouter)

router.post("/sample", async req => {
  const decodeResult = SampleReq.decode(req.body)
  console.log("got sample request")
  console.log(`${JSON.stringify(decodeResult)}`)
  console.log(`${typeof decodeResult}`)
  return decodeResult
})

export default apiRouter
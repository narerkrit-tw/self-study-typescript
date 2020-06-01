import * as express from "express"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import * as T from "io-ts"
import { optionFromNullable as TOpt } from "io-ts-types/lib/optionFromNullable"
import RestypedRouter from "restyped-express-async"

const SampleReq = T.type({
  someNumber: T.number,
  optionalBoolean: TOpt(T.boolean)
})

type SampleReq = T.TypeOf<typeof SampleReq>
type SampleResp = {
  success: boolean
}

type SampleAPI = {
  "/sample": {
    POST: {
      body: SampleReq
      response: SampleResp
    }
  }
}

const apiRouter = express.Router()
const router = RestypedRouter<SampleAPI>(apiRouter)

router.post("/sample", async (req, resp) => {
  const decodeResult = SampleReq.decode(req.body)
  pipe(
    decodeResult,
    E.fold(err => 400, body => 201 ),
    x => resp.status(x)
  )
  return {
    success: E.isRight(decodeResult)
  }
})

export default apiRouter
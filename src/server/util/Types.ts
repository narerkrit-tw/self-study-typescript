import * as Exp from "express"
import { Do } from "fp-ts-contrib/lib/Do"
import * as EI from "fp-ts/lib/Either"
import * as HTTP from "http"
import * as T from "io-ts"
import { BooleanFromString } from "io-ts-types/lib/BooleanFromString"
import { NumberFromString } from "io-ts-types/lib/NumberFromString"
import { optionFromNullable as tOpt } from "io-ts-types/lib/optionFromNullable"

// reduced interface of Express' Request and Response type
export type RawRequest = {
  headers: HTTP.IncomingHttpHeaders
  body: unknown
  params: unknown
  query: unknown
}

export type RawResponse = {
  status: (n: number) => RawResponse
  json: (a: unknown) => RawResponse
}

export type TypedRequest<A, P = unknown, Q = unknown > = {
  headers: HTTP.IncomingHttpHeaders
  body: A
  params: P
  query: Q
}

export type TypedResponse<A> = {
  status: number
  body: A
}

export type HandleParseError = {
  (e: T.Errors, resp: RawResponse): void
}

export type BuildHandler<A, B, P = unknown, Q = unknown> = 
  (h: TypedApiHandler<A, B, P, Q>, handleError: HandleParseError) => HandlerFn
export type HandlerFn = (req: RawRequest, res: RawResponse) => void

export type TypedApiHandler<A, B, P = unknown, Q = unknown> = 
  (req: TypedRequest<A, P, Q>) => TypedResponse<B>

type Decoder<A> = T.Decoder<unknown, A>
type Encoder<A> = T.Encoder<unknown, A>

export const defaultHandleError: HandleParseError = (e, res) => {
  res.status(400).json(e)
}

export const wrap = 
  <A, B, P, Q >(TA: Decoder<A>, TB: Encoder<B>, TP: Decoder<P>, TQ: Decoder<Q>): BuildHandler<A, B, P, Q> => 
  (h: TypedApiHandler<A, B, P, Q>, handleError: HandleParseError = defaultHandleError): HandlerFn => 
  (req: RawRequest, resp: RawResponse): void => {
    const typedRespEi = Do(EI.either)
      .bind("body", TA.decode(req.body))
      .bind("params", TP.decode(req.params))
      .bind("query", TQ.decode(req.query))
      .letL( "typedReq", (o) => ({
        ...o,
        headers: req.headers
      }))
      .letL("typedResp", ({typedReq}) => h(typedReq))
      .return(({typedResp}) => typedResp )

    switch(typedRespEi._tag) {
      case "Left":
        handleError(typedRespEi.left, resp)
        break
      case "Right":
        resp
          .status(typedRespEi.right.status)
          .json(TB.encode(typedRespEi.right.body))
        break
    }
}

export const wrapBodies = <A, B>(TA: Decoder<A>, TB: Encoder<B>): BuildHandler<A, B> =>
  wrap(TA, TB, T.unknown, T.unknown)

export const wrapGet = <B, P, Q>(TB: Encoder<B>, TP: Decoder<P>, TQ: Decoder<Q>): BuildHandler<unknown, B, P, Q> => 
  wrap(T.unknown, TB, TP, TQ)
export const wrapResponseBody = <B>(TB: Encoder<B>): BuildHandler<unknown, B> => 
  wrapGet(TB, T.unknown, T.unknown)

const test1 = wrap(
  T.type({
    hello: T.string,
    maybe: tOpt(T.string)
  }),
  T.boolean,
  T.type({ id: NumberFromString }), 
  T.type({q: BooleanFromString})
)(tReq => {
  console.log(tReq.body)
  tReq.body.maybe
  tReq.params.id
  return {
    status: 201,
    body: tReq.body.hello.length === 0
  }
}, defaultHandleError)
const test2 = wrapBodies(
  T.type({"hello": T.string}), T.number
)(tReq => {
  return {
    status: 200,
    body: 1000
  }
}, defaultHandleError)

export const TestRouter = Exp.Router()
TestRouter.post("/test/:id", test1)
TestRouter.post("/test2", test2)
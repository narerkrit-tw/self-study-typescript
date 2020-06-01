import * as Exp from "express"
import * as EC from "express-serve-static-core"
import { Do } from "fp-ts-contrib/lib/Do"
import * as E from "fp-ts/lib/Either"
import * as HTTP from "http"
import * as T from "io-ts"


type ApiHandler = {
  (req: Exp.Request): Exp.Response
}

type TypedRequest<A, P = EC.ParamsDictionary, Q = EC.Query > = {
  headers: HTTP.IncomingHttpHeaders
  typedBody: A
  typedParams: P
  typedQuery: Q
}

type TypedResponse<A> = {
  status: number
  body: A
}

type TypedApiHandler<A, B, P = EC.ParamsDictionary, Q = EC.Query> = {
  (req: TypedRequest<A, P, Q>): TypedResponse<B>
}

const wrap = <A, B, P, Q>(TA: T.Type<A>, TB: T.Type<B>, TP: T.Type<P>, TQ: T.Type<Q> ) => (h: TypedApiHandler<A, B, P, Q>) => (req: Exp.Request, resp: Exp.Response): void => {
  const typedRespEi = Do(E.either)
    .bind("reqBody", TA.decode(req.body))
    .bind("reqParams", TP.decode(req.params))
    .bind("reqQuery", TQ.decode(req.query))
    .letL( "typedReq", ({reqBody, reqParams, reqQuery}) => ({
      headers: req.headers,
      typedBody: reqBody,
      typedParams: reqParams,
      typedQuery: reqQuery
    }))
    .letL("typedResp", ({typedReq}) => h(typedReq))
    .return(({typedResp}) => typedResp )

  switch(typedRespEi._tag) {
    case "Left":
      resp.status(400).json(typedRespEi.left)
      break
    case "Right":
      resp
        .status(typedRespEi.right.status)
        .json(TB.encode(typedRespEi.right.body))
      break
  }
}
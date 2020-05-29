import * as express from "express"

export interface RouterWs extends express.Router {
  ws (route: string, ...cb): RouterWs 
}
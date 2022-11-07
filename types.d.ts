import { Request, Response } from 'express'
import { CorsOptions } from 'cors'
import { JwtPayload } from 'jsonwebtoken'

export interface origin extends CorsOptions {
  origin?: any
}

export interface SpecialRequest extends Request {
  id?: any
  companyId?: any
  isAdmin?: any
}

export interface SpecialResponse extends Response {
  header: any
  origin: any
}

export interface TokenPayload extends JwtPayload {
  id?: string
}

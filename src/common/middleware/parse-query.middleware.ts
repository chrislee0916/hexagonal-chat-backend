import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

function parseQuery(input: unknown, defaultVal: number): string {
  const parsed = parseInt(String(input), 10);
  if (Number.isNaN(parsed)) {
    return String(defaultVal);
  }
  return String(Math.max(defaultVal, parsed));
}

@Injectable()
export class ParseQueryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.method === 'GET') {
      req.query.limit = parseQuery(req.query.limit, 25);
      req.query.skip = parseQuery(req.query.skip, 0);
      req.query.sort = req.query.sort ? req.query.sort : '-createdAt';
    }
    next();
  }
}

import * as _ from 'lodash';
import * as Promise from 'bluebird';
import { Request, Response, NextFunction } from 'express';

export function sampleGetUsersService(req: Request, res: Response, next: NextFunction, url: URL): void {
  const someSampleParam = req.query.someSampleParam;
  console.log(someSampleParam);
  res.status(200).send({
    success: true,
    message: "Successfully fetched!!"
  })
};
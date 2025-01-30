import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';


const authorize = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are UNAUTHORIZED');
    }

    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(StatusCodes.UNAUTHORIZED, 'you are UNAUTHORIZED');
        }

        const role = (decoded as JwtPayload).role;

        if (requiredRole && !requiredRole.includes(role)) {
          throw new AppError(
            StatusCodes.UNAUTHORIZED,
            'you are not authorized',
          );
        }
        //decoded
        req.user = decoded as JwtPayload;

        next();
      },
    );
  });
};




export default authorize;

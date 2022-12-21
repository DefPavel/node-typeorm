import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Получаем токен jwt из header
    const token = <string>req.headers["auth"];
    let jwtPayload;

    //Попытка проверить токен и получить данные
    try {
        jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //(unauthorized)
        res.status(401).send({error: "ошибка токена"});
        return;
    }

    //Токен действителен 1 час
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.JWT_SECRET, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    //Вызов следующего контроллера
    next();
};
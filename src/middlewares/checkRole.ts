import { Request, Response, NextFunction } from "express";
// import { getRepository } from "typeorm"; Уже такой подход устарел
import { AppDataSource } from '../data-source'


import { User } from "../entity/User";
export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Получить идентификатор пользователя из предыдущего middleware
        const id = res.locals.jwtPayload.userId;
        //Получить роль пользователя из базы данных
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: { id: id }});
        } catch (id) {
            res.status(401).send({error: "Пользователь не найден"});
        }


        //Проверить, включает ли массив авторизованных пользователей
        if (roles.indexOf(user.role) > -1) next();
        else res.status(401).send();
    };
};
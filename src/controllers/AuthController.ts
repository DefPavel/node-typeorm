import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from '../data-source'
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";
export const login = async (req: Request, res: Response) => {
    //Проверка логина и пароля
    const {username, password} = req.body;
    if (!(username && password)) {
        res.status(400).send();
    }

    //Найти запись в базе данных
    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
        user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
        res.status(401).end();
    }

    //Проверить соответствие зашифрованного пароля
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).end();
        return;
    }

    //Sing JWT
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        config.JWT_SECRET,
        { expiresIn: "1h" }
    );

    //Вывести токен JWT
    res.status(200).send({ token: token });
};
export const changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;
    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
        res.status(400).send();
    }
    //Get user from the database
    const userRepository = AppDataSource.getRepository(User);
    let user: User;
    try {
        user = await userRepository.findOneOrFail({where: {id : id}});
    } catch (id) {
        res.status(401).send();
    }
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send();
        return;
    }
    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    //Hash the new password and save
    user.hashPassword();
    await userRepository.save(user);

    res.status(204).send();
};
import { Request, Response } from "express";
import { AppDataSource } from '../data-source'
import { validate } from "class-validator";
import { User } from "../entity/User";
export const listAll = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
        select: ["id", "username", "role"]
    });
    res.send(users);
};
export const getOneById = async (req: Request, res: Response) => {
    const id: number = req.params.id;
    const userRepository = AppDataSource.getRepository(User);
    try {
       const user = await userRepository.findOneOrFail({ where: { id: id } });
       res.status(200).send(user);
    } catch (error) {
        res.status(404).send({error: "Пользователь не найден"});
    }
};

export const newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    const {username, password, role} = req.body;
    const user = new User();
    user["username"] = username;
    user["password"] = password;
    user["role"] = role;

    const errors = await validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    //Hash the password, to securely store on DB
    user.hashPassword();
    //Try to save. If fails, the username is already in use
    const userRepository = AppDataSource.getRepository(User);
    try {
        await userRepository.save(user);
    } catch (e) {
        res.status(409).send("Данное имя уже занято");
        return;
    }

    //If all ok, send 201 response
    res.status(201).send("Пользователь создан");
};

export const editUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { username, role } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    let user;
    try {
        user = await userRepository.findOneOrFail({where: { id: id }});
    } catch (error) {
        res.status(404).send("User not found");
        return;
    }

    //Validate the new values on model
    user["username"] = username;
    user["role"] = role;
    const errors = await validate(user);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }
    try {
        await userRepository.save(user);
    } catch (e) {
        res.status(409).send("username already in use");
        return;
    }
    res.status(204).send();
};

export const deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = AppDataSource.getRepository(User);
    try {
        await userRepository.findOneOrFail({where: { id : id} });
    } catch (error) {
        res.status(404).send({error: "Пользователь не найден"});
        return;
    }
    await userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
};
import { MigrationInterface, QueryRunner } from "typeorm"
import { User } from "../entity/User";
import { AppDataSource } from "../data-source"

export class CreateSuperUser1671647432259 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await AppDataSource.manager.save(
            AppDataSource.manager.create(User, {
                id: 1,
                username: "admin",
                password: "admin",
                hashPassword(){},
                role: "ADMIN"

            }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

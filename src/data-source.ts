import "reflect-metadata"
import { DataSource } from "typeorm"
import config from "../src/config/config";
export const AppDataSource = new DataSource({
    type: config.TYPE_DATABASE as "postgres",
    host: config.HOST,
    port: config.PORT,
    username: config.USERNAME,
    password: config.PASSWORD,
    database: config.DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        "src/entity/**/*.ts"
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    //entities: ["dist/**/*.entity{.ts,.js}"],
    //migrations: ["dist/migration/*{.ts,.js}"],
    subscribers: [],
});

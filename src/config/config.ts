import * as path from "path";
import * as dotenv from "dotenv";

// Parsing the env file.
dotenv.config(/*{ path: path.resolve(__dirname, "../config/config.env") }*/);
interface ENV {
    JWT_SECRET : string | undefined;
    TYPE_DATABASE: string | undefined;
    HOST: string | undefined;
    PORT: number | undefined;
    USERNAME: string | undefined;
    PASSWORD: string | undefined;
    DATABASE: string | undefined;
}
interface Config {
    JWT_SECRET : string;
    TYPE_DATABASE: string;
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    DATABASE: string;
}
const getConfig = (): ENV => {
    return {
        JWT_SECRET: process.env.JWT_SECRET ?? "secret",
        TYPE_DATABASE: process.env.TYPE_DATABASE ?? "postgres",
        DATABASE: process.env.DATABASE ?? "users_db",
        HOST: process.env.HOST ?? "localhost",
        USERNAME: "postgres",
        PASSWORD: process.env.PASSWORD ?? "1497",
        PORT: process.env.PORT ? Number(process.env.PORT) : 5432
    };
};
const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as Config;
};

const config = getConfig();
console.log(config)
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
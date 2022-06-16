import "reflect-metadata"
import { DataSource } from "typeorm"
import { Goal, ActionItem } from "./entity"
import { MONGODB_DBNAME, MONGODB_HOST, MONGODB_PASSWORD, MONGODB_PORT, MONGODB_USER } from "./utils/environment"

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: MONGODB_HOST,
    database: MONGODB_DBNAME,
    username: MONGODB_USER,
    password: MONGODB_PASSWORD,
    authSource: "admin",
    port: parseInt(MONGODB_PORT),
    synchronize: true,
    logging: false,
    entities: [Goal, ActionItem],
    migrations: [],
    subscribers: [],
})

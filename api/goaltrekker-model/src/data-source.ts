import "reflect-metadata"
import { DataSource } from "typeorm"
import { Goal, ActionItem } from "./entity"

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    database: "goaltrekk_local",
    username: "docker",
    password: "mongopw",
    authSource: "admin",
    port: 55000,
    synchronize: true,
    logging: false,
    entities: [Goal, ActionItem],
    migrations: [],
    subscribers: [],
})

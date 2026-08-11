import { createMigrationsList, createOrmConfig } from "@dextinity/cms-api";
import { DataloaderType, EntityCaseNamingStrategy, TextType, Type } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
import path from "path";

export const ormConfig = createOrmConfig(
    defineConfig({
        host: process.env.POSTGRESQL_HOST,
        port: Number(process.env.POSTGRESQL_PORT),
        user: process.env.POSTGRESQL_USER,
        password: process.env.POSTGRESQL_PASSWORD,
        dbName: process.env.POSTGRESQL_DB,
        driverOptions: {
            connection: { ssl: process.env.POSTGRESQL_USE_SSL === "true" ? { rejectUnauthorized: true, ca: process.env.POSTGRESQL_CA_CERT } : false },
        },
        namingStrategy: EntityCaseNamingStrategy,
        debug: false,
        discovery: {
            getMappedType(type: string, platform) {
                // Map all string types to TEXT instead of VARCHAR
                if (type === "string") {
                    return Type.getType(TextType);
                }
                return platform.getDefaultMappedType(type);
            },
        },
        connect: process.env.MIKRO_ORM_NO_CONNECT !== "true",
        migrations: {
            tableName: "Migrations",
            //  `path` is only used to tell MikroORM where to place newly generated migrations. Available migrations are defined using `migrationsList`.
            path: "./src/db/migrations",
            migrationsList: createMigrationsList(path.resolve(__dirname, "migrations")),
            disableForeignKeys: false,
            dropTables: false,
            snapshot: false,
        },
        dataloader: DataloaderType.ALL,
    }),
);

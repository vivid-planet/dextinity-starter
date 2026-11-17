import {
    AccessLogModule,
    BlobStorageModule,
    BlocksModule,
    BlocksTransformerMiddlewareFactory,
    DamModule,
    DependenciesModule,
    ImgproxyModule,
    PageTreeModule,
    RedirectsModule,
    UserPermissionsModule,
    WarningsModule,
} from "@dextinity/cms-api";
import { ApolloDriver, type ApolloDriverConfig, ValidationError } from "@nestjs/apollo";
import { type DynamicModule, Module } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { type Enhancer, GraphQLModule } from "@nestjs/graphql";
import { AppPermission } from "@src/auth/app-permission.enum.js";
import { DbModule } from "@src/db/db.module.js";
import { Link } from "@src/documents/links/entities/link.entity.js";
import { LinksModule } from "@src/documents/links/links.module.js";
import { Page } from "@src/documents/pages/entities/page.entity.js";
import { PagesModule } from "@src/documents/pages/pages.module.js";
import { FootersModule } from "@src/footers/footers.module.js";
import { HealthcheckModule } from "@src/healthcheck/healthcheck.module.js";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope.js";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity.js";
import { RedirectScope } from "@src/redirects/dto/redirect-scope.js";
import type { ContentScope as BaseContentScope } from "@src/site-configs.js";
import type { Request } from "express";

import { AccessControlService } from "./auth/access-control.service.js";
import { AuthModule } from "./auth/auth.module.js";
import { SYSTEM_USER_NAME } from "./auth/constants.js";
import { StaticUsersUserService } from "./auth/static-users.user.service.js";
import type { Config } from "./config/config.js";
import { ConfigModule } from "./config/config.module.js";
import { DamFile } from "./dam/entities/dam-file.entity.js";
import { DamFolder } from "./dam/entities/dam-folder.entity.js";
import { MenusModule } from "./menus/menus.module.js";

@Module({})
export class AppModule {
    static forRoot(config: Config): DynamicModule {
        const authModule = AuthModule.forRoot(config);
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot(config),
                DbModule,
                GraphQLModule.forRootAsync<ApolloDriverConfig>({
                    driver: ApolloDriver,
                    imports: [BlocksModule],
                    useFactory: (moduleRef: ModuleRef) => ({
                        debug: config.debug,
                        graphiql: config.debug ? { url: "/api/graphql" } : undefined,
                        playground: false,
                        // Prevents writing the schema.gql file in production. Necessary for environments with a read-only file system
                        autoSchemaFile: process.env.NODE_ENV === "development" ? "schema.gql" : true,
                        sortSchema: true,
                        formatError: (error) => {
                            // Disable GraphQL field suggestions in production
                            if (!config.debug) {
                                if (error.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
                                    return new ValidationError("Invalid request.");
                                }
                            }
                            return error;
                        },
                        context: ({ req }: { req: Request }) => ({ ...req }),
                        cors: {
                            origin: config.corsAllowedOrigin,
                            methods: ["GET", "POST"],
                            credentials: false,
                            maxAge: 600,
                        },
                        useGlobalPrefix: true,
                        // See https://docs.nestjs.com/graphql/other-features#execute-enhancers-at-the-field-resolver-level
                        fieldResolverEnhancers: ["guards", "interceptors", "filters"] as Enhancer[],
                        buildSchemaOptions: {
                            fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(moduleRef)],
                        },
                        persistedQueries: false,
                    }),
                    inject: [ModuleRef],
                }),
                authModule,
                UserPermissionsModule.forRootAsync({
                    useFactory: (userService: StaticUsersUserService, accessControlService: AccessControlService) => ({
                        availableContentScopes: config.siteConfigs.flatMap((siteConfig) =>
                            siteConfig.scope.languages.map((language) => ({
                                scope: {
                                    domain: siteConfig.scope.domain,
                                    language,
                                },
                                label: { domain: siteConfig.name, language: language.toUpperCase() },
                            })),
                        ),
                        userService,
                        accessControlService,
                        systemUsers: [SYSTEM_USER_NAME],
                    }),
                    inject: [StaticUsersUserService, AccessControlService], // TODO Implement correct UserService and remove convertJwtToUser in AuthModule
                    imports: [authModule],
                    AppPermission,
                }),
                BlocksModule,
                LinksModule,
                PagesModule,
                PageTreeModule.forRoot({
                    PageTreeNode: PageTreeNode,
                    Documents: [Page, Link],
                    Scope: PageTreeNodeScope,
                    sitePreviewSecret: config.sitePreviewSecret,
                }),
                RedirectsModule.register({ Scope: RedirectScope }),
                BlobStorageModule.register({
                    backend: config.blob.storage,
                    cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
                }),
                ImgproxyModule.register(config.imgproxy),
                DamModule.register({
                    File: DamFile,
                    Folder: DamFolder,
                    damConfig: {
                        secret: config.dam.secret,
                        allowedImageSizes: config.dam.allowedImageSizes,
                        allowedAspectRatios: config.dam.allowedImageAspectRatios,
                        filesDirectory: `${config.blob.storageDirectoryPrefix}-files`,
                        maxFileSize: config.dam.uploadsMaxFileSize,
                        maxSrcResolution: config.dam.maxSrcResolution,
                    },
                }),
                HealthcheckModule,
                MenusModule,
                DependenciesModule,
                FootersModule,
                WarningsModule,
                ...(!config.debug
                    ? [
                          AccessLogModule.forRoot({
                              shouldLogRequest: ({ req }) => !req.route.path.startsWith("/api/healthcheck/"),
                          }),
                      ]
                    : []),
            ],
        };
    }
}

declare module "@dextinity/cms-api" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}
}

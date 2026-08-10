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
} from "@comet/cms-api";
import { ApolloDriver, ApolloDriverConfig, ValidationError } from "@nestjs/apollo";
import { DynamicModule, Module } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Enhancer, GraphQLModule } from "@nestjs/graphql";
import { AppPermission } from "@src/auth/app-permission.enum";
import { DbModule } from "@src/db/db.module";
import { Link } from "@src/documents/links/entities/link.entity";
import { LinksModule } from "@src/documents/links/links.module";
import { Page } from "@src/documents/pages/entities/page.entity";
import { PagesModule } from "@src/documents/pages/pages.module";
import { FootersModule } from "@src/footers/footers.module";
import { HealthcheckModule } from "@src/healthcheck/healthcheck.module";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";
import { RedirectScope } from "@src/redirects/dto/redirect-scope";
import { ContentScope as BaseContentScope } from "@src/site-configs";
import { Request } from "express";

import { AccessControlService } from "./auth/access-control.service";
import { AuthModule, SYSTEM_USER_NAME } from "./auth/auth.module";
import { StaticUsersUserService } from "./auth/static-users.user.service";
import { Config } from "./config/config";
import { ConfigModule } from "./config/config.module";
import { DamFile } from "./dam/entities/dam-file.entity";
import { DamFolder } from "./dam/entities/dam-folder.entity";
import { MenusModule } from "./menus/menus.module";

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

declare module "@comet/cms-api" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}
}

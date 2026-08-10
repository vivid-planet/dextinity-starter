import {
    createAuthGuardProviders,
    createAuthResolver,
    createBasicAuthService,
    createJwtAuthService,
    createSitePreviewAuthService,
    DextinityAuthGuard,
} from "@dextinity/cms-api";
import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { Config } from "@src/config/config";

import { AccessControlService } from "./access-control.service";
import { StaticUsersUserService } from "./static-users.user.service";

export const SYSTEM_USER_NAME = "system-user";

@Module({})
export class AuthModule {
    static forRoot(config: Config): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                createAuthResolver({
                    postLogoutRedirectUri: config.auth.postLogoutRedirectUri,
                    endSessionEndpoint: config.auth.idpEndSessionEndpoint,
                }),
                AccessControlService,
                StaticUsersUserService,
                {
                    provide: APP_GUARD,
                    useClass: DextinityAuthGuard,
                },
                ...createAuthGuardProviders(
                    ...[
                        createBasicAuthService({
                            username: SYSTEM_USER_NAME,
                            password: config.auth.systemUserPassword,
                        }),
                        createSitePreviewAuthService({ sitePreviewSecret: config.sitePreviewSecret }),
                        createJwtAuthService({
                            verifyOptions: {
                                audience: config.auth.idpClientId,
                            },
                            jwksOptions: {
                                jwksUri: config.auth.idpJwksUri,
                            },
                        }),
                    ],
                ),
            ],
            exports: [AccessControlService, StaticUsersUserService],
            imports: [JwtModule],
        };
    }
}

import { AbstractAccessControlService, type ContentScopesForUser, type PermissionsForUser, type User, UserPermissions } from "@dextinity/cms-api";
import { Inject, Injectable } from "@nestjs/common";
import type { Config } from "@src/config/config.js";
import { CONFIG } from "@src/config/config.module.js";

@Injectable()
export class AccessControlService extends AbstractAccessControlService {
    constructor(@Inject(CONFIG) private readonly config: Config) {
        super();
    }

    getPermissionsForUser(user: User): PermissionsForUser {
        if (this.hasAllPermissions(user)) {
            return UserPermissions.allPermissions;
        }

        return [];
    }

    getContentScopesForUser(user: User): ContentScopesForUser {
        if (this.hasAllPermissions(user)) {
            return UserPermissions.allContentScopes;
        }

        return [];
    }

    private hasAllPermissions(user: User) {
        return this.config.acl.allPermissionsEmails.includes(user.email) || this.config.acl.allPermissionsDomains.includes(user.email.split("@")[1]);
    }
}

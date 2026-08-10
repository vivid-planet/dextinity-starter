import { type User, UserPermissions } from "@dextinity/cms-api";
import { Test, type TestingModule } from "@nestjs/testing";
import type { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { beforeEach, describe, expect, it } from "vitest";

import { AccessControlService } from "./access-control.service";
import { staticUsers } from "./static-users";

describe("AccessControlService", () => {
    let service: AccessControlService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccessControlService,
                {
                    provide: CONFIG,
                    useValue: {
                        acl: {
                            allPermissionsEmails: ["admin@customer.com"],
                            allPermissionsDomains: ["vivid-planet.com"],
                        } satisfies Config["acl"],
                    },
                },
            ],
        }).compile();

        service = module.get<AccessControlService>(AccessControlService);
    });

    describe("getPermissionsForUser", () => {
        it("should return no permissions by default", () => {
            const unknownUser: User = {
                id: "b26d86a7-32bb-4c84-ab9d-d167dddd40ff",
                name: "Unknown User",
                email: "unknown@example.com",
            };

            const permissions = service.getPermissionsForUser(unknownUser);

            expect(permissions).toEqual([]);
        });

        it("should return all permissions for Vivid Planet employee", () => {
            const permissions = service.getPermissionsForUser(staticUsers.vividPlanetEmployee);

            expect(permissions).toEqual(UserPermissions.allPermissions);
        });

        it("should return all permissions for Admin", () => {
            const permissions = service.getPermissionsForUser(staticUsers.admin);

            expect(permissions).toEqual(UserPermissions.allPermissions);
        });
    });

    describe("getContentScopesForUser", () => {
        it("should return no content scopes by default", () => {
            const unknownUser: User = {
                id: "b26d86a7-32bb-4c84-ab9d-d167dddd40ff",
                name: "Unknown User",
                email: "unknown@example.com",
            };

            const contentScopes = service.getContentScopesForUser(unknownUser);

            expect(contentScopes).toEqual([]);
        });

        it("should return all content scopes for Vivid Planet employee", () => {
            const contentScopes = service.getContentScopesForUser(staticUsers.vividPlanetEmployee);

            expect(contentScopes).toEqual(UserPermissions.allContentScopes);
        });

        it("should return all content scopes for Admin", () => {
            const contentScopes = service.getContentScopesForUser(staticUsers.admin);

            expect(contentScopes).toEqual(UserPermissions.allContentScopes);
        });
    });
});

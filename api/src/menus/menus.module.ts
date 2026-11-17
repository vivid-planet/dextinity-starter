import { Module } from "@nestjs/common";

import { MenusResolver } from "./menus.resolver.js";

@Module({
    providers: [MenusResolver],
})
export class MenusModule {}

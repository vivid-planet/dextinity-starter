import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { Page } from "./entities/page.entity.js";
import { PagesResolver } from "./pages.resolver.js";

@Module({
    imports: [MikroOrmModule.forFeature([Page])],
    providers: [PagesResolver],
})
export class PagesModule {}

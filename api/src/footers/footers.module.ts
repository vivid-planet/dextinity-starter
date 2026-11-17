import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { FooterResolver } from "@src/footers/generated/footer.resolver.js";
import { FootersService } from "@src/footers/generated/footers.service.js";

import { Footer } from "./entities/footer.entity.js";

@Module({
    imports: [MikroOrmModule.forFeature([Footer])],
    providers: [FootersService, FooterResolver],
})
export class FootersModule {}

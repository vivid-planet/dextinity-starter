import { Module } from "@nestjs/common";

import { HealthcheckController } from "./healthcheck.controller.js";

@Module({ controllers: [HealthcheckController] })
export class HealthcheckModule {}

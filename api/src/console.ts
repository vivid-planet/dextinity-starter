import opentelemetry from "@opentelemetry/api";
import { AppModule } from "@src/app.module.js";
import { useContainer } from "class-validator";
import { CommandFactory } from "nest-commander";

import { createConfig } from "./config/config.js";
import { sdk } from "./tracing.js";

const tracer = opentelemetry.trace.getTracer("console");
const config = createConfig(process.env);
const appModule = AppModule.forRoot(config);

async function bootstrap() {
    tracer.startActiveSpan(process.argv.slice(2).join(" "), async (span) => {
        const app = await CommandFactory.createWithoutRunning(appModule, {
            logger: ["error", "warn", "log"],
            serviceErrorHandler: async (error) => {
                console.error(error);
                span.end();
                await sdk?.shutdown();
                process.exit(1);
            },
        });

        try {
            await app.init();

            // class-validator should use Nest for dependency injection.
            // See https://github.com/nestjs/nest/issues/528,
            //     https://github.com/typestack/class-validator#using-service-container.
            useContainer(app.select(appModule), { fallbackOnErrors: true });

            await CommandFactory.runApplication(app);

            span.end();
            await sdk?.shutdown();
            await app.close();
            process.exit(0);
        } catch (e) {
            console.error(e);

            span.end();
            await sdk?.shutdown();
            await app.close();
            process.exit(1);
        }
    });
}

bootstrap();

import { register } from "node:module";

import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import * as opentelemetry from "@opentelemetry/sdk-node";
import { createAddHookMessageChannel } from "import-in-the-middle";

// Lets the instrumentations patch ES modules. The message channel limits the hook to the modules the instrumentations patch: wrapping every module breaks packages with circular imports.
const { registerOptions, waitForAllMessagesAcknowledged } = createAddHookMessageChannel();
register("import-in-the-middle/hook.mjs", import.meta.url, registerOptions);

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: `http://${process.env.JAEGER_HOST}:${process.env.JAEGER_OLTP_PORT}/v1/traces`,
    }),
    metricReaders: [],
    instrumentations: [
        getNodeAutoInstrumentations({
            "@opentelemetry/instrumentation-pg": {
                requestHook: (span, queryInfo) => {
                    span.updateName(`pg: ${queryInfo.query.text.substring(0, 100)}`);
                },
            },
            "@opentelemetry/instrumentation-knex": {
                enabled: false,
            },
            "@opentelemetry/instrumentation-grpc": {
                enabled: false,
            },
            "@opentelemetry/instrumentation-graphql": {
                mergeItems: true,
            },
        }),
    ],
    serviceName: "starter-api",
});

sdk.start();

await waitForAllMessagesAcknowledged();

export { sdk };

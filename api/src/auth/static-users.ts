import type { User } from "@dextinity/cms-api";

export const staticUsers = {
    admin: {
        id: "3b09cc12-c7e6-4d16-b858-40a822f2c548",
        name: "Static User - Admin",
        email: "admin@customer.com",
    },
    vividPlanetEmployee: {
        id: "a19a100d-3bce-4b29-ad47-e6119d15923e",
        name: "Static User - Employee",
        email: "employee@vivid-planet.com",
    },
    editor: {
        id: "a0b13472-1ee5-4afc-8734-be661e60334f",
        name: "Static User - German Editor",
        email: "german-editor@customer.com",
    },
} satisfies Record<string, User>;

import { PrismaClient } from "@/generated/prisma/client";
import { Injectable } from "@nestjs/common";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// The Neon serverless driver speaks WebSocket. In a Node runtime there is no
// global WebSocket, so it must be supplied explicitly or every query throws an
// ErrorEvent. (Edge/browser runtimes have it built in.)
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
neonConfig.webSocketConstructor = ws;

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
        super({ adapter });
    }
}

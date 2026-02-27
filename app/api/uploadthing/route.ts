import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Modular Architecture (Option A)
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});

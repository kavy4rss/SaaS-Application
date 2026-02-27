import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const f = createUploadthing();

// Modular Architecture (Option A)
export const ourFileRouter = {
    // Define an endpoint for uploading moodboard sketches
    moodboardImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        // Only authenticated users can upload
        .middleware(async () => {
            const session = await auth();
            if (!session || !session.user || !session.user.id) {
                throw new Error("Unauthorized");
            }
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);

            // We could save to Prisma here, but we'll return the URL to the client
            // who will then call the saveSketchToDatabase action with the projectId.
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

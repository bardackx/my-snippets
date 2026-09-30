const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
};

const server = Deno.serve(async (req) => {
    const url = new URL(req.url);

    // REST API
    if (url.pathname === "/api/hello") {
        return Response.json({ message: "Hello!" });
    }

    // SSE
    if (url.pathname === "/api/events") {
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(
                    `data: ${JSON.stringify({ message: "connected" })}\n\n`,
                );

                const interval = setInterval(() => {
                    controller.enqueue(
                        `data: ${JSON.stringify({ time: Date.now() })}\n\n`,
                    );
                }, 1000);

                req.signal.addEventListener("abort", () => {
                    clearInterval(interval);
                    controller.close();
                });
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    }

    // Static files
    const filePath = url.pathname === "/"
        ? "../client/dist/index.html"
        : `../client/dist${url.pathname}`;

    try {
        const file = await Deno.open(filePath);

        const ext = filePath.slice(filePath.lastIndexOf("."));
        const contentType = contentTypes[ext] ?? "application/octet-stream";

        return new Response(file.readable, {
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch {
        return new Response("Not Found", { status: 404 });
    }
});

console.log(`Listening on ${server.addr.hostname}:${server.addr.port}`);

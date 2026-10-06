const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {

    // Serve HTML page
    if (req.method === "GET" && req.url === "/") {

        const filePath = path.join(__dirname, "index.html");

        fs.readFile(filePath, (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("Error loading page");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });

        return;
    }

    // Calculator API
    if (req.method === "POST" && req.url === "/calculate") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                const num1 = Number(data.num1);
                const num2 = Number(data.num2);
                const operation = data.operation;

                let result;

                switch (operation) {

                    case "add":
                        result = num1 + num2;
                        break;

                    case "subtract":
                        result = num1 - num2;
                        break;

                    case "multiply":
                        result = num1 * num2;
                        break;

                    case "divide":

                        if (num2 === 0) {
                            result = "Cannot divide by zero";
                        } else {
                            result = num1 / num2;
                        }

                        break;

                    default:
                        result = "Invalid operation";
                }

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    result: result
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    result: "Invalid request"
                }));
            }
        });

        return;
    }

    // Page not found
    res.writeHead(404);
    res.end("404 - Page Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Calculator running on port ${PORT}`);
});
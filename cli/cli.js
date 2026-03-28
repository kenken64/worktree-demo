const http = require("http");

http.get("http://localhost:3000/api", (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    const json = JSON.parse(data);
    console.log(json.message);
  });
}).on("error", (err) => {
  console.error("Error:", err.message);
});

# Multi-Project Git Repo Using Worktrees

A single Git repository hosting three independent projects — **backend**, **frontend**, and **cli** — each living on its own orphan branch and checked out as a separate worktree directory.

## Disk Layout

### Worktree branches (side-by-side directories)

```
git-demo/
├── worktree/    ← backend branch  (server.js)
├── frontend/    ← frontend branch (index.html)
└── cli/         ← cli branch      (cli.js)
```

### Main branch (monorepo)

```
main/
├── README.md
├── backend/
│   └── server.js
├── frontend/
│   └── index.html
└── cli/
    └── cli.js
```

## Step-by-Step Setup

### Step 1 — Initialize the Repository

```bash
git init
```

### Step 2 — Create the `backend` Branch

Create an orphan branch (no parent commit) and add a simple HTTP server.

```bash
git checkout --orphan backend
```

Create `server.js`:

```js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ message: "Hello World" }));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}/api`);
});
```

Stage and commit:

```bash
git add server.js
git commit -m "Add backend HTTP server with GET /api endpoint"
```

### Step 3 — Create the `frontend` Branch

Create another orphan branch and clean up staged files from the previous branch.

```bash
git checkout --orphan frontend
git rm --cached server.js
```

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Frontend</title>
</head>
<body>
  <h1 id="output">Loading...</h1>
  <script>
    fetch("http://localhost:3000/api")
      .then(res => res.json())
      .then(data => {
        document.getElementById("output").textContent = data.message;
      })
      .catch(err => {
        document.getElementById("output").textContent = "Error: " + err.message;
      });
  </script>
</body>
</html>
```

Stage and commit:

```bash
git add index.html
git commit -m "Add frontend web app that fetches from backend"
```

### Step 4 — Create the `cli` Branch

Create a third orphan branch and clean up staged files.

```bash
git checkout --orphan cli
git rm --cached index.html
```

Create `cli.js`:

```js
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
```

Stage and commit:

```bash
git add cli.js
git commit -m "Add CLI tool that calls backend and prints response"
```

### Step 5 — Switch Back to `backend`

```bash
git checkout backend
```

### Step 6 — Create Worktrees

Check out the `frontend` and `cli` branches as separate directories alongside the main worktree.

```bash
git worktree add ../frontend frontend
git worktree add ../cli cli
```

### Step 7 — Verify

```bash
git worktree list
git log --all --oneline --decorate
```

Expected output:

```
/path/to/git-demo/worktree  e99039a [backend]
/path/to/git-demo/frontend  b227a4d [frontend]
/path/to/git-demo/cli       460b313 [cli]
```

## Running the Projects

**Start the backend:**

```bash
node backend/server.js
```

**Open the frontend:**

```bash
open frontend/index.html    # or just open the file in a browser
```

**Run the CLI:**

```bash
node cli/cli.js
```

import { Express } from "./lib/routes.js";
import { host, IP_ADRESS, PORT } from "./lib/network.js";
import { userController } from "./controller/user.js";
import { postsController } from "./controller/posts.js";
const app = new Express();

app.get("/users", userController.GET);
app.post("/users", userController.POST)

app.request("/posts", postsController.GET, "GET");
app.request("/posts/:postId", postsController.GET, "GET")
app.request("/posts", postsController.POST, "POST");
app.request("/posts/:postId", postsController.PUT, "PUT")
app.request("/posts/:postId", postsController.DELETE, "DELETE")

app.listen(PORT, () => {
    console.log(`Server is running ${host}`)
})
import server from "./server";
import cors from "cors";

server.listen(5010, () => {
  console.log("Server is running on port 5010");
});

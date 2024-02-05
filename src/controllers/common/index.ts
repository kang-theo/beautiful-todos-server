import { Router } from "express";

const router = Router();

/* The next function in Express is typically used when you have asynchronous operations, 
** or want to pass control to the next middleware in the stack. 
** Here is synchronously with a JSON object, so there's no need to use next().
*/
router.get("/healthcheck", (req, res) => {
  res.json({
    statusCode: 200,
    message: "OK",
  });
});

export default router;
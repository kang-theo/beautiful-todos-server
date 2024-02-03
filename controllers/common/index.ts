import { Router } from "express";

const router = Router();

router.get("/healthcheck", (req, res) => {
  res.json({
    statusCode: 200,
    message: "OK",
  });
});

export default router;
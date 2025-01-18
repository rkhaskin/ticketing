import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // use sessionCookie to sign out
  req.session = null;

  res.send({});
});

export { router as signoutRouter };

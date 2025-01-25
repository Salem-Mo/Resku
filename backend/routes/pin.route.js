import express from "express";

import { savePin, getPins,delPin } from "../controllers/map.controller.js";

const mapRouter = express.Router();

mapRouter.post("/", savePin);

mapRouter.get("/", getPins);
mapRouter.delete("/", delPin);


export default mapRouter;

import express, { Request, Response } from "express";

import cors from "cors";
import * as yappy from "yappy-node-back-sdk";
import dotenv from "dotenv";

import {
  PagosBgUrlBody,
  PaymentInfo,
  ValidatorParams,
} from "yappy-node-back-sdk/dist/types/common/main";

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

dotenv.config();

const yappyClient = yappy.createClient(
  process.env.MERCHANT_ID!,
  process.env.SECRET_KEY!
);

app.get(
  "/pagosbgurl",
  async (req: Request<any, any, PagosBgUrlBody, any>, res: Response) => {
    const response = await yappyClient.getPaymentUrl(req.body);
    if (!response.success) {
      res.status(500).send(response);
    } else {
      res.send(response);
    }
  }
);

app.post(
  "/pagosbg",
  (req: Request<any, any, any, ValidatorParams>, res: Response) => {
    const success = yappyClient.validateHash(req.query);
    if (success) {
      //Your bussiness logic
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

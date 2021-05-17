import express, { Application } from "express";
import cors from "cors";
import { PagosBgRoutes } from "./routes/pagosbg.routes.js";

export class App {
  private app: Application;
  public pagosBgRoutes: PagosBgRoutes;

  constructor(private port?: number | string) {
    this.pagosBgRoutes = new PagosBgRoutes();
    this.app = express();
    this.initialize();
  }

  initialize() {
    this.app.set("port", this.port || process.env.PORT || 3000);
    this.middleware();
    this.routes();
  }

  middleware() {
    //morgan
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    //logger
  }

  routes() {
    this.pagosBgRoutes.routes(this.app);
  }

  listen() {
    this.app.listen(this.app.get("port"));
    console.log("Listening on port", this.app.get("port"));
  }
}

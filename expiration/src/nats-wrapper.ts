import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  // for ts: this property might be undefined for some period of time
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw Error(
        "Cannot access NATS client. Might not have been initialized yet"
      );
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

// create a singleton: export not a class, but a single instance of the class
export const natsWrapper = new NatsWrapper();

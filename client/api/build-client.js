import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server

    // we need to include full ingress service url in the request for the request to be routed to a final destination. And headers "host" and "cookie".

    // SERVICE_NAME.NAMESPACE.svc.cluster.local - this is a url to the ingress service
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // we are on the client
    return axios.create({
      baseURL: "/",
    });
  }
};

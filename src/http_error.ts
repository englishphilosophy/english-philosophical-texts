import type { Status } from "http";

export default class HttpError extends Error {
  status: Status;

  constructor(status: Status, message: string) {
    super(message);
    this.status = status;
  }
}

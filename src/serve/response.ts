import { STATUS_CODE } from "$std/http/mod.ts";
import { contentType } from "$std/media_types/mod.ts";

export const okResponse = (content: unknown) => {
  const body = typeof content === "string" ? content : JSON.stringify(content);
  return new Response(body, {
    status: STATUS_CODE.OK,
    headers: responseHeaders(contentType("json")),
  });
};

export const routeErrorResponse = () =>
  errorResponse("The requested URL doesn't match any route.", STATUS_CODE.NotFound);

export const idErrorResponse = () =>
  errorResponse("The requested ID doesn't match any text.", STATUS_CODE.NotFound);

export const queryErrorResponse = () =>
  errorResponse("The query is not in the correct format.", STATUS_CODE.BadRequest);

export const errorResponse = (
  error: unknown,
  status: number = STATUS_CODE.InternalServerError
): Response => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Internal server error.";
  return new Response(`{"error":"${message}"}`, {
    status,
    headers: responseHeaders(contentType("json")),
  });
};

export const responseHeaders = (contentType: string) => {
  const h = new Headers();
  h.set("content-type", contentType);
  h.set("Access-Control-Allow-Origin", "*");
  return h;
};

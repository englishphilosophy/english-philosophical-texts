type HandlerArgs = {
  urlPatternResult: URLPatternResult;
  request: Request;
};

export type Handler = (args: HandlerArgs) => Response | Promise<Response>;

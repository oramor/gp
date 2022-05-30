type JsonObject = {
    [key: string]: string | number | JsonObject
}

type AbstractActionResult = {
    httpStatus: HttpStatus;
}

type ActionResult<T> = T & AbstractActionResult;

interface SendJsonActionDto {
    json: JsonObject;
}

export class BaseAction {
    public static sendJson(obj: JsonObject): ActionResult<SendJsonActionDto> {
        return {
            json: obj,
            httpStatus: 200
        }
    }
}
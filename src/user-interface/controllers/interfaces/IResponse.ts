interface IResponse {
    success: boolean;
    message: string;
    response: any;
    httpStatus: string | number;
    code?: string | number;
}
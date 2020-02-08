export class ErrorResponse {
    errorCode: number;
    errorMessage: string;
    stack: string;
    constructor(errorCode, errorMessage, stack) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.stack = this.stack;
    }
}

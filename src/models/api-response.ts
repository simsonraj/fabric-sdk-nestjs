
import { ErrorResponse } from './error-response';

export class ApiResponse {
    statusCode: number;
    message: string;
    data: any;
    error: ErrorResponse;
    constructor(statusCode, message, data, error,
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.error = error;
    }
  }

export class ApiResponse {
    constructor(status, data, message) {
        this.status = status;
        if (data) {
            this.data = data
        }
        this.message = message;
        this.success = status < 399;
    }
}
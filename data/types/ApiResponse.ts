type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | { success: false; message: string };

export default ApiResponse;

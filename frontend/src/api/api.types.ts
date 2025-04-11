export type SuccessMessage = {
  message: string;
  success: true;
};

export type ApiError = {
  message: string;
  success: false;
};

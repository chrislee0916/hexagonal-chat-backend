// * 成功執行的返回格式
// export interface DefaultSuccessResponse {
//   success: boolean;
//   runTimes: number;
//   time: string;
//   timestamp: number;
// }

export interface SuccessResponse /*extends DefaultSuccessResponse */ {
  success: boolean;
  data: any;
  runTimes: number;
  time: string;
  timestamp: number;
}

// * 發生錯誤的返回格式
export interface ErrorResponse {
  success: boolean;
  path: string;
  detail: object;
  time: string;
  timestamp: number;
}

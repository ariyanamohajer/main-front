import { axiosInstance, endpoints } from "../config/config";
import type {
  ApiResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdatePersonalInfoRequest,
  UpdatePersonalInfoResponse,
} from "@/types";
import type { GetUserInfoResult } from "@/types";

export const getUserInfo = async (): Promise<
  ApiResponse<GetUserInfoResult>
> => {
  const response = await axiosInstance.get<ApiResponse<GetUserInfoResult>>(
    endpoints.user.getUserInfo,
    {
      headers: {
        keyResponse: "22",
      },
    }
  );
  return response.data;
};

export const updatePersonalInfo = async (
  payload: UpdatePersonalInfoRequest
): Promise<UpdatePersonalInfoResponse> => {
  const response = await axiosInstance.post<UpdatePersonalInfoResponse>(
    endpoints.user.updateUserInfo, // /UserAccount/UpdatePersonalInfo
    payload,
    {
      headers: {
        keyResponse: "22",
      },
    }
  );
  return response.data;
};

// NEW: Change password
export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const response = await axiosInstance.post<ChangePasswordResponse>(
    endpoints.user.updatePassword, // /UserAccount/ChangePass
    payload,
    {
      headers: {
        keyResponse: "22",
      },
    }
  );
  return response.data;
};

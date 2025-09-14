import type { ContactUsRequest, ContactUsResponse } from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const contactUs = async (
  contactUsData: ContactUsRequest
): Promise<ContactUsResponse> => {
  const response = await axiosInstance.post<ContactUsResponse>(
    endpoints.user.contactUs,
    contactUsData
  );

  return response.data;
};

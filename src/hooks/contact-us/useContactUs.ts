import { useMutation } from "@tanstack/react-query";
import type { ContactUsRequest, ContactUsResponse } from "@/types";
import { AxiosError } from "axios";
import { contactUs } from "@/services/contact-us/contact";

interface useContactUsOptions {
  onSuccess?: (data: ContactUsResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useContactUs = (options?: useContactUsOptions) => {
  return useMutation<ContactUsResponse, AxiosError, ContactUsRequest>({
    mutationFn: contactUs,
    onSuccess: (data) => {
      if (data.success) {
        options?.onSuccess?.(data);
      } else {
        // Handle API-level errors (success: false)
        const error = new Error(data.message) as AxiosError;
        options?.onError?.(error);
      }
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};

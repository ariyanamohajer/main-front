import type {
  IncreaseWalletCreditRequest,
  IncreaseWalletCreditResponse,
} from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const increaseWalletCredit = async (
  data: IncreaseWalletCreditRequest
): Promise<IncreaseWalletCreditResponse> => {
  const form = new FormData();

  // Accept File/Blob (preferred) or base64 data URL
  const img = (data as IncreaseWalletCreditRequest).DepositSlipImage;
  if (img) {
    if (img instanceof File || img instanceof Blob) {
      form.append("DepositSlipImage", img, (img as File).name ?? "deposit.png");
    } else if (typeof img === "string") {
      // Handle base64 data URL fallback
      const blob = dataURLtoBlob(img);
      form.append("DepositSlipImage", blob, "deposit.png");
    }
  }

  const response = await axiosInstance.post<IncreaseWalletCreditResponse>(
    endpoints.wallet.increaseCredit,
    form,
    {
      // These become ?Amount=...&Description=...&PaymentMethod=...
      params: {
        Amount: data.Amount,
        Description: data.Description,
        PaymentMethod: data.PaymentMethod,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

/** Convert a base64 data URL to Blob (browser only). */
function dataURLtoBlob(dataURL: string): Blob {
  const [meta, base64] = dataURL.split(",");
  const mime =
    /data:(.*?);base64/.exec(meta)?.[1] ?? "application/octet-stream";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

import { axiosInstance } from "@/services/config/config";

export interface AddCommentRequest {
  Text: string;
  Star?: number;
  ProductId: string;
}

export interface UpdateCommentRequest {
  CommentId: string;
  Text: string;
  Star: number;
}

export interface RemoveCommentRequest {
  CommentId: string;
}

export interface AddCommentResponse {
  result: {
    commentId: string;
  };
  success: boolean;
  message: string;
  code: number;
}

export interface CommentOperationResponse {
  success: boolean;
  message: string;
  code: number;
}

export const commentsService = {
  addComment: async (data: AddCommentRequest): Promise<AddCommentResponse> => {
    const response = await axiosInstance.post(
      "/Product/AddNewProductCommnet",
      null,
      {
        params: data,
        headers: {
          KeyResponse: "22",
        },
      }
    );
    return response.data;
  },

  updateComment: async (
    data: UpdateCommentRequest
  ): Promise<CommentOperationResponse> => {
    const response = await axiosInstance.post(
      "/Product/UpdateProductComment",
      null,
      {
        headers: {
          KeyResponse: "22",
        },
        params: {
          CommentId: data.CommentId,
          Text: data.Text,
          Star: data.Star,
        },
      }
    );
    return response.data;
  },

  removeComment: async (
    data: RemoveCommentRequest
  ): Promise<CommentOperationResponse> => {
    const response = await axiosInstance.delete(
      "/Product/RemoveProductComment",
      {
        params: data,
        headers: {
          KeyResponse: "22",
        },
      }
    );
    return response.data;
  },
};

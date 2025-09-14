// import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Star,
  MessageCircle,
  Clock,
  Edit,
  Trash2,
  Send,
  Plus,
} from "lucide-react";
import { useProduct } from "@/hooks/products";
import { useAuth } from "@/context/auth";
import { useAddComment } from "@/hooks/comments/useAddComment";
import { useUpdateComment } from "@/hooks/comments/useUpdateComments";
import { useRemoveComment } from "@/hooks/comments/useRemoveComment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { ProductComment } from "@/types";
import { LazyImage } from "@/components/common/LazyLoading";
import { ProductQuestionsSection } from "@/components/features/questions";

import GameOrderDialog from "@/components/features/game/GameOrderDialog";
import { useLocation, useNavigate } from "react-router-dom";


// ← import your game constants
import { type GameType, GameTypeValues } from "@/types/game";



function mapCategoryToGame(categoryId?: number, categoryName?: string): GameType | null {
  // If your API already uses 1/2/3 for category ids, this is enough:
  if (categoryId === 1) return GameTypeValues.Pubg;
  if (categoryId === 2) return GameTypeValues.CallOfDuty;
  if (categoryId === 3) return GameTypeValues.ClashOfClans;

  // Fallback by category name (fa/en)
  const name = (categoryName || "").toLowerCase();
  if (/(pubg|پابجی)/.test(name)) return GameTypeValues.Pubg;
  if (/(call ?of ?duty|cod|کالاف)/.test(name)) return GameTypeValues.CallOfDuty;
  if (/(clash ?of ?clans|کلش)/.test(name)) return GameTypeValues.ClashOfClans;

  return null;
}

interface CommentFormData {
  text: string;
  star: number;
}

const ProductDetailView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openGameOrder, setOpenGameOrder] = useState(false);
  const { productName } = useParams<{ productName: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { data: response, isLoading, error } = useProduct(productName || "");
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !response?.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center">
          <CardContent className="py-8">
            <h2 className="text-xl font-bold text-destructive mb-2">
              خطا در بارگذاری محصول
            </h2>
            <p className="text-muted-foreground">
              {response?.message || "محصول مورد نظر یافت نشد"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

    const product = response?.result;
  const resolvedGame = mapCategoryToGame(product?.categoryId, product?.categoryName ?? undefined);
  const selectedImage = product.images[selectedImageIndex] || product.images[0];

    // ✅ Resolve game from product category
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const resolvedGame = useMemo(
  //   () => mapCategoryToGame(product?.categoryId, product?.categoryName ?? undefined),
  //   [product?.categoryId, product?.categoryName]
  // );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              <LazyImage
                src={selectedImage?.name || ""}
                alt={selectedImage?.alt || product.name}
                className="w-full h-96 object-cover"
              />
            </CardContent>
          </Card>

          {/* Thumbnail Images */}
          {product?.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product?.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                >
                  <img
                    src={image.name}
                    alt={image.alt}
                    className="w-20 h-20 object-cover"
                  />
                  {/* <LazyImage src={image.name} alt={product.name} className="w-20 h-20 object-cover" /> */}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            {product.categoryName && (
              <Badge variant="secondary" className="mb-4">
                {product?.categoryName}
              </Badge>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="text-2xl font-bold text-primary">
                {product.price.toLocaleString("fa-IR")} تومان
              </div>
              <Badge
                variant={product?.status === 1 ? "secondary" : "destructive"}
              >
                {product.status === 1 ? "موجود" : "ناموجود"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">توضیحات محصول</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                if (!isAuthenticated) {
                  // send to login with redirect back
                  navigate(
                    `/auth/login?next=${encodeURIComponent(location.pathname)}`
                  );
                  return;
                }
                setOpenGameOrder(true);
              }}
            >
              ثبت سفارش بازی
            </Button>
            <Button variant="outline" size="lg">
              علاقه‌مندی
            </Button>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <ProductQuestionsSection
        productId={product.id}
        productName={product.name}
      />

      {/* Comments Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              نظرات کاربران ({product.comments.length})
            </CardTitle>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                افزودن نظر
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          {showCommentForm && isAuthenticated && (
            <AddCommentForm
              productId={product.id}
              onSuccess={() => setShowCommentForm(false)}
            />
          )}

          {!isAuthenticated && (
            <div className="text-center py-6 border border-dashed border-muted-foreground/25 rounded-lg">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-3">
                برای ثبت نظر ابتدا وارد حساب کاربری خود شوید
              </p>
              <Button variant="outline" size="sm">
                ورود / ثبت نام
              </Button>
            </div>
          )}

          {/* Existing Comments */}
          {product.comments.length > 0 ? (
            <div className="space-y-6">
              {product.comments.map((comment) => (
                <EnhancedCommentCard
                  key={comment.commentId}
                  comment={comment}
                  currentUserPhone={user?.phone}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                هنوز نظری برای این محصول ثبت نشده است
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {resolvedGame && (
        <GameOrderDialog
          open={openGameOrder}
          onOpenChange={setOpenGameOrder}
          productId={product.id}
          productName={product.name}
          game={resolvedGame}
        />
      )}
    </div>
  );
};

// Enhanced Comment Component with Edit/Delete functionality
const EnhancedCommentCard = ({
  comment,
  currentUserPhone,
}: {
  comment: ProductComment;
  currentUserPhone?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [editStar, setEditStar] = useState(comment.star);

  const updateComment = useUpdateComment();
  const removeComment = useRemoveComment();

  const canEdit = currentUserPhone === comment.userPhone;

  const handleEdit = () => {
    updateComment.mutate(
      {
        CommentId: comment.commentId,
        Text: editText,
        Star: editStar,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این نظر اطمینان دارید؟")) {
      removeComment.mutate({
        CommentId: comment.commentId,
      });
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
  }: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
  }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4 transition-colors",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground",
            !readonly && "cursor-pointer hover:text-yellow-400"
          )}
          onClick={() => !readonly && onRatingChange?.(i + 1)}
        />
      ))}
    </div>
  );

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={comment.userAvatar}
            alt={comment.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{comment.userName}</p>
            {isEditing ? (
              <StarRating rating={editStar} onRatingChange={setEditStar} />
            ) : (
              <StarRating rating={comment.star} readonly />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {new Date(comment.insertTime).toLocaleDateString("fa-IR")}
          </div>
          {canEdit && (
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEdit}
                    disabled={updateComment.isPending}
                    className="h-8 w-8 p-0"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={removeComment.isPending}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <Textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          className="min-h-[80px]"
        />
      ) : (
        <p className="text-foreground leading-relaxed">{comment.text}</p>
      )}

      {comment.answers.length > 0 && (
        <div className="mr-8 space-y-3 border-r-2 border-muted pr-4">
          {comment.answers.map((answer) => (
            <EnhancedCommentCard
              key={answer.commentId}
              comment={answer}
              currentUserPhone={currentUserPhone}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add Comment Form Component
const AddCommentForm = ({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess: () => void;
}) => {
  const form = useForm<CommentFormData>({
    defaultValues: {
      text: "",
      star: 5,
    },
  });

  const addComment = useAddComment();

  const onSubmit = (data: CommentFormData) => {
    addComment.mutate(
      {
        Text: data.text,
        Star: data.star,
        ProductId: productId,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess();
        },
      }
    );
  };

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
  }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-5 w-5 transition-colors cursor-pointer",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground hover:text-yellow-400"
          )}
          onClick={() => onRatingChange(i + 1)}
        />
      ))}
      <span className="mr-2 text-sm text-muted-foreground">
        ({rating} از 5)
      </span>
    </div>
  );

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-lg">افزودن نظر جدید</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="star"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>امتیاز شما</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              rules={{
                required: "لطفا نظر خود را بنویسید",
                minLength: {
                  value: 10,
                  message: "نظر شما باید حداقل 10 کاراکتر باشد",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نظر شما</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="نظر خود را در مورد این محصول بنویسید..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={addComment.isPending}
                className="flex items-center gap-2"
              >
                {addComment.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    ثبت نظر
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSuccess}
                disabled={addComment.isPending}
              >
                انصراف
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton Component
const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full h-96 rounded-xl" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          <Separator />

          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Separator />

          <div className="flex gap-4">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </div>

      {/* Comments Skeleton */}
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailView;

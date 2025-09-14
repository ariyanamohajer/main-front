import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Clock,
  User,
  Edit,
  Trash2,
  Send,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/auth";
import {
  useGetUserQuestions,
  useAddQuestion,
  useUpdateQuestion,
  useRemoveQuestion,
} from "@/hooks/questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { UserProductQuestion } from "@/types";

interface QuestionFormData {
  text: string;
}

interface ProductQuestionsSectionProps {
  productId: string;
  productName: string;
}

const ProductQuestionsSection = ({
  productId,
  productName,
}: ProductQuestionsSectionProps) => {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const { user, isAuthenticated } = useAuth();

  // Fetch questions
  const {
    data: questionsResponse,
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetUserQuestions({
    ProductId: productId,
    "Pagination.PageIndex": pageIndex,
    "Pagination.PageSize": pageSize,
  });

  const questions = questionsResponse?.result?.productQuestions || [];
  const pagination = questionsResponse?.result?.pagination;

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  // Loading skeleton for questions
  const QuestionSkeleton = () => (
    <div className="border border-border/40 rounded-xl p-6 space-y-4 bg-gradient-to-br from-card/50 to-muted/20">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );

  // Error component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-destructive/10 to-destructive/5 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
    </div>
  );

  return (
    <Card className="mb-8 overflow-hidden border-border/40 bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <HelpCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              {questions.length > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold shadow-md"
                >
                  {questions.length}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                پرسش‌ها و پاسخ‌ها
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {pagination ? `${pagination.totalRow} پرسش` : "بارگذاری..."} •{" "}
                {productName}
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className={cn(
                "flex items-center gap-2 transition-all duration-200",
                "border-primary/20 hover:border-primary/40",
                "bg-gradient-to-r from-primary/5 to-secondary/5",
                "hover:from-primary/10 hover:to-secondary/10",
                showQuestionForm &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Plus className="h-4 w-4" />
              {showQuestionForm ? "بستن فرم" : "طرح پرسش"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Add Question Form */}
        {showQuestionForm && isAuthenticated && (
          <AddQuestionForm
            productId={productId}
            onSuccess={() => setShowQuestionForm(false)}
          />
        )}

        {!isAuthenticated && (
          <div className="text-center py-8 border border-dashed border-primary/20 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              برای طرح پرسش وارد شوید
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              برای پرسیدن سوالات خود در مورد این محصول، ابتدا وارد حساب کاربری
              خود شوید
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20"
            >
              ورود / ثبت نام
            </Button>
          </div>
        )}

        {/* Questions List */}
        {questionsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <QuestionSkeleton key={index} />
            ))}
          </div>
        ) : questionsError ? (
          <ErrorMessage message="خطا در بارگذاری پرسش‌ها. لطفا دوباره تلاش کنید." />
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              هنوز پرسشی طرح نشده
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              اولین نفری باشید که در مورد این محصول سوال می‌پرسد
            </p>
            {isAuthenticated && (
              <Button
                variant="outline"
                className="mt-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20"
                onClick={() => setShowQuestionForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                طرح اولین پرسش
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <EnhancedQuestionCard
                key={question.questionId}
                question={question}
                currentUserPhone={user?.phone}
                isExpanded={expandedQuestions.has(question.questionId)}
                onToggleExpansion={() =>
                  toggleQuestionExpansion(question.questionId)
                }
              />
            ))}

            {/* Pagination */}
            {pagination && pagination.totalRow > pageSize && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                  disabled={pageIndex === 0}
                  className="bg-gradient-to-r from-muted/50 to-muted/30"
                >
                  قبلی
                </Button>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="px-3 py-1">
                    صفحه {pageIndex + 1} از{" "}
                    {Math.ceil(pagination.totalRow / pageSize)}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageIndex(pageIndex + 1)}
                  disabled={(pageIndex + 1) * pageSize >= pagination.totalRow}
                  className="bg-gradient-to-r from-muted/50 to-muted/30"
                >
                  بعدی
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced Question Card Component
const EnhancedQuestionCard = ({
  question,
  currentUserPhone,
  isExpanded,
  onToggleExpansion,
}: {
  question: UserProductQuestion;
  currentUserPhone?: string;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(question.text);

  const updateQuestion = useUpdateQuestion();
  const removeQuestion = useRemoveQuestion();

  const canEdit = currentUserPhone === question.userPhone;
  const hasAnswers = question.answers.length > 0;

  const handleEdit = () => {
    updateQuestion.mutate(
      {
        QuestionId: question.questionId,
        Text: editText,
        KeyResponse: "22",
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این پرسش اطمینان دارید؟")) {
      removeQuestion.mutate({
        QuestionId: question.questionId,
      });
    }
  };

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-gradient-to-br from-card/60 to-muted/20 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6 space-y-4">
        {/* Question Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={question.userAvatar}
                alt={question.userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-border/40 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-full border-2 border-card"></div>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {question.userName}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                {question.userPhone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {new Date(question.insertTime).toLocaleDateString("fa-IR")}
            </div>

            {canEdit && (
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEdit}
                      disabled={updateQuestion.isPending}
                      className="h-8 w-8 p-0 bg-gradient-to-r from-primary/10 to-secondary/10"
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
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDelete}
                      disabled={removeQuestion.isPending}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question Text */}
        {isEditing ? (
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="متن پرسش خود را بنویسید..."
            className="min-h-[80px] border-border/40 focus:border-primary/40 bg-muted/20"
          />
        ) : (
          <p className="text-foreground leading-relaxed bg-gradient-to-br from-muted/20 to-muted/10 p-4 rounded-lg border border-border/20">
            {question.text}
          </p>
        )}

        {/* Answers Toggle */}
        {hasAnswers && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpansion}
              className="flex items-center gap-2 text-primary hover:bg-primary/10"
            >
              <MessageSquare className="h-4 w-4" />
              {question.answers.length} پاسخ
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Badge variant="secondary" className="text-xs">
              {question.status ? "تأیید شده" : "در انتظار بررسی"}
            </Badge>
          </div>
        )}
      </div>

      {/* Answers Section */}
      {hasAnswers && isExpanded && (
        <div className="border-t border-border/40 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-secondary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground">پاسخ‌ها</h4>
            </div>

            <div className="space-y-4">
              {question.answers.map((answer) => (
                <div
                  key={answer.questionId}
                  className="bg-card/60 rounded-lg p-4 border border-border/40"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={answer.userAvatar}
                      alt={answer.userName}
                      className="w-8 h-8 rounded-full object-cover border border-border/40"
                    />
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {answer.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(answer.insertTime).toLocaleDateString(
                          "fa-IR"
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {answer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Question Form Component
const AddQuestionForm = ({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess: () => void;
}) => {
  const form = useForm<QuestionFormData>({
    defaultValues: {
      text: "",
    },
  });

  const addQuestion = useAddQuestion();

  const onSubmit = (data: QuestionFormData) => {
    addQuestion.mutate(
      {
        ProductId: productId,
        Text: data.text,
        KeyResponse: "22",
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess();
        },
      }
    );
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <Plus className="h-4 w-4 text-primary-foreground" />
          </div>
          طرح پرسش جدید
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          سوال خود را در مورد این محصول بپرسید
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              rules={{
                required: "لطفا پرسش خود را بنویسید",
                minLength: {
                  value: 10,
                  message: "پرسش شما باید حداقل 10 کاراکتر باشد",
                },
                maxLength: {
                  value: 500,
                  message: "پرسش شما نباید از 500 کاراکتر بیشتر باشد",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    متن پرسش
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="سوال خود را در مورد این محصول بپرسید..."
                      className="min-h-[120px] resize-none border-border/40 focus:border-primary/40 bg-card/50"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <span className="text-xs text-muted-foreground">
                      {field.value.length}/500
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={addQuestion.isPending}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                {addQuestion.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    ثبت پرسش
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSuccess}
                disabled={addQuestion.isPending}
                className="border-border/40 hover:bg-muted/50"
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

export default ProductQuestionsSection;

// // src/components/features/game/GameOrderDialog.tsx
// import * as React from "react";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
// } from "@/components/ui/select";
// import { Loader2, Gamepad2, Plus, User, CheckCircle2 } from "lucide-react";
// import {
//   GAME_LABELS, type GameType, GameTypeValues, guessGameFromText,
// } from "@/types/game";
// import { useGameAccounts } from "@/hooks/games/useGameAccounts";
// import { useAddGameAccount } from "@/hooks/games/useAddGameAccount";
// import { useAddNewGameOrder } from "@/hooks/games/useAddNewGameOrder";

// type Props = {
//   open: boolean;
//   onOpenChange: (o: boolean) => void;
//   productId: string;
//   productName?: string;
// };

// export default function GameOrderDialog({ open, onOpenChange, productId, productName }: Props) {
//   // Guess game from productName; user can change
//   const [game, setGame] = React.useState<GameType | null>(guessGameFromText(productName));
//   const { data: accounts, isLoading: accLoading } = useGameAccounts(game);

//   // Selected existing account
//   const [selectedGameAccountId, setSelectedGameAccountId] = React.useState<string | null>(null);

//   // Toggle add account form
//   const [showAdd, setShowAdd] = React.useState(false);

//   // Add account form
//   const [newAccId, setNewAccId] = React.useState<string>("");
//   const [newAccName, setNewAccName] = React.useState<string>("");

//   const addAcc = useAddGameAccount();
//   const addOrder = useAddNewGameOrder();

//   // When game changes, reset selections
//   React.useEffect(() => {
//     setSelectedGameAccountId(null);
//   }, [game]);

//   const canSubmit = !!selectedGameAccountId && !!game && !addOrder.isPending;

//   const onAddAccount = () => {
//     if (!game) return;
//     const numericId = Number(String(newAccId).replace(/\D+/g, ""));
//     if (!numericId) return;

//     addAcc.mutate(
//       { accountId: numericId, accountName: newAccName?.trim() || undefined, game },
//       {
//         onSuccess: (res) => {
//           if (res?.success && res.result?.gameAccountId) {
//             // Auto select the newly created account after list refetch
//             setSelectedGameAccountId(res.result.gameAccountId);
//             setNewAccId("");
//             setNewAccName("");
//             setShowAdd(false);
//           }
//         },
//       }
//     );
//   };

//   const onSubmitOrder = () => {
//     if (!selectedGameAccountId) return;
//     // NOTE: backend expects key 'prodcutId'
//     addOrder.mutate(
//       { prodcutId: productId, gameAccountId: selectedGameAccountId },
//       {
//         onSuccess: (res) => {
//           if (res.success) {
//             onOpenChange(false);
//           }
//         },
//       }
//     );
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg w-[95vw]" dir="rtl">
//         <DialogHeader>
//           <DialogTitle className="text-xl flex items-center gap-2">
//             <Gamepad2 className="w-5 h-5 text-primary" />
//             ثبت سفارش بازی
//           </DialogTitle>
//           <DialogDescription className="text-muted-foreground">
//             محصول: <span className="text-foreground font-semibold">{productName || "—"}</span>
//           </DialogDescription>
//         </DialogHeader>

//         {/* Game selection */}
//         <div className="space-y-2">
//           <Label>انتخاب بازی</Label>
//           <Select
//             value={game ? String(game) : ""}
//             onValueChange={(v) => setGame(Number(v) as GameType)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="یک بازی انتخاب کنید" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={String(GameTypeValues.Pubg)}>{GAME_LABELS[GameTypeValues.Pubg]}</SelectItem>
//               <SelectItem value={String(GameTypeValues.CallOfDuty)}>{GAME_LABELS[GameTypeValues.CallOfDuty]}</SelectItem>
//               <SelectItem value={String(GameTypeValues.ClashOfClans)}>{GAME_LABELS[GameTypeValues.ClashOfClans]}</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Separator />

//         {/* Existing accounts */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="flex items-center gap-2">
//               <User className="w-4 h-4 text-muted-foreground" />
//               انتخاب اکانت ذخیره‌شده
//             </Label>
//             <Badge variant="secondary">
//               {game ? GAME_LABELS[game] : "—"}
//             </Badge>
//           </div>

//           <Select
//             disabled={!game || accLoading}
//             value={selectedGameAccountId ?? ""}
//             onValueChange={setSelectedGameAccountId}
//           >
//             <SelectTrigger>
//               <SelectValue
//                 placeholder={accLoading ? "در حال بارگذاری..." : "اکانت را انتخاب کنید"}
//               />
//             </SelectTrigger>
//             <SelectContent>
//               {accounts?.length ? (
//                 accounts.map((a) => (
//                   <SelectItem key={a.id} value={a.id}>
//                     #{a.accountId} — {a.accountName || "بدون نام"}
//                   </SelectItem>
//                 ))
//               ) : (
//                 <div className="p-3 text-sm text-muted-foreground">
//                   اکانتی برای این بازی پیدا نشد.
//                 </div>
//               )}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Add account (optional) */}
//         <div className="rounded-lg border p-3 space-y-3">
//           <div className="flex items-center justify-between">
//             <Label>افزودن اکانت جدید (اختیاری)</Label>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => setShowAdd((s) => !s)}
//             >
//               <Plus className="w-4 h-4 ml-1" />
//               {showAdd ? "بستن" : "افزودن"}
//             </Button>
//           </div>

//           {showAdd && (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               <div className="sm:col-span-1 space-y-2">
//                 <Label htmlFor="acc-id">شناسه اکانت</Label>
//                 <Input
//                   id="acc-id"
//                   dir="ltr"
//                   inputMode="numeric"
//                   placeholder="مثلاً 12345"
//                   value={newAccId}
//                   onChange={(e) => setNewAccId(e.target.value)}
//                 />
//               </div>
//               <div className="sm:col-span-2 space-y-2">
//                 <Label htmlFor="acc-name">نام اکانت</Label>
//                 <Input
//                   id="acc-name"
//                   placeholder="(اختیاری)"
//                   value={newAccName}
//                   onChange={(e) => setNewAccName(e.target.value)}
//                 />
//               </div>

//               {/* Game (locked to current selection, but user can change via header select) */}
//               <div className="sm:col-span-3">
//                 <Button
//                   type="button"
//                   onClick={onAddAccount}
//                   disabled={!game || addAcc.isPending || !String(newAccId).replace(/\D+/g, "")}
//                 >
//                   {addAcc.isPending ? (
//                     <>
//                       <Loader2 className="w-4 h-4 ml-2 animate-spin" />
//                       در حال افزودن…
//                     </>
//                   ) : (
//                     "ثبت اکانت"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>

//         <DialogFooter className="sm:justify-start">
//           <Button onClick={onSubmitOrder} disabled={!canSubmit}>
//             {addOrder.isPending ? (
//               <>
//                 <Loader2 className="w-4 h-4 ml-2 animate-spin" />
//                 در حال ثبت سفارش…
//               </>
//             ) : (
//               <>
//                 <CheckCircle2 className="w-4 h-4 ml-2" />
//                 ثبت سفارش
//               </>
//             )}
//           </Button>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             انصراف
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


// src/components/features/game/GameOrderDialog.tsx
import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Gamepad2, Plus, User, CheckCircle2,
} from "lucide-react";
import {
  GAME_LABELS, type GameType,
} from "@/types/game";
import { useGameAccounts } from "@/hooks/games/useGameAccounts";
import { useAddGameAccount } from "@/hooks/games/useAddGameAccount";
import { useAddNewGameOrder } from "@/hooks/games/useAddNewGameOrder";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  productId: string;
  productName?: string;
  /** ← now required: the game for this product, resolved by ProductDetailView */
  game: GameType;
};

export default function GameOrderDialog({
  open,
  onOpenChange,
  productId,
  productName,
  game,
}: Props) {
  // Accounts for this game only (no game selector any more)
  const { data: accounts, isLoading: accLoading, refetch } = useGameAccounts(game);

  // Selected existing account
  const [selectedGameAccountId, setSelectedGameAccountId] = React.useState<string | null>(null);

  // Add account form toggle
  const [showAdd, setShowAdd] = React.useState(false);

  // Add account inputs
  const [newAccId, setNewAccId] = React.useState<string>("");
  const [newAccName, setNewAccName] = React.useState<string>("");

  const addAcc = useAddGameAccount();
  const addOrder = useAddNewGameOrder();

  // When dialog opens or accounts change, preselect if there is exactly one account
  React.useEffect(() => {
    if (!open) return;
    if (accounts?.length === 1) {
      setSelectedGameAccountId(accounts[0].id);
      setShowAdd(false);
    } else if (!accounts?.length) {
      // if no account yet, open the "add account" box for convenience
      setSelectedGameAccountId(null);
      setShowAdd(true);
    } else {
      // keep previous selection if still present
      if (selectedGameAccountId && accounts?.some(a => a.id === selectedGameAccountId)) return;
      setSelectedGameAccountId(null);
    }
  }, [open, accounts]);

  const canSubmit = !!selectedGameAccountId && !addOrder.isPending;

  const onAddAccount = () => {
    const numericId = Number(String(newAccId).replace(/\D+/g, ""));
    if (!numericId) return;

    addAcc.mutate(
      { accountId: numericId, accountName: newAccName?.trim() || undefined, game },
      {
        onSuccess: async (res) => {
          if (res?.success && res.result?.gameAccountId) {
            // refresh list and auto-select
            await refetch();
            setSelectedGameAccountId(res.result.gameAccountId);
            setNewAccId("");
            setNewAccName("");
            setShowAdd(false);
          }
        },
      }
    );
  };

  const onSubmitOrder = () => {
    if (!selectedGameAccountId) return;
    // NOTE: backend expects key 'prodcutId'
    addOrder.mutate(
      { prodcutId: productId, gameAccountId: selectedGameAccountId },
      {
        onSuccess: (res) => {
          if (res.success) {
            onOpenChange(false);
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[95vw]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            ثبت سفارش بازی
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            محصول: <span className="text-foreground font-semibold">{productName || "—"}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Game is locked and inferred from product */}
        <div className="flex items-center justify-between">
          <Label>بازی</Label>
          <Badge variant="secondary">{GAME_LABELS[game]}</Badge>
        </div>

        <Separator />

        {/* Existing accounts for this game */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              انتخاب اکانت ذخیره‌شده
            </Label>
            <Badge variant="outline">{accounts?.length ?? 0} اکانت</Badge>
          </div>

          <div className="rounded-md border p-2">
            {accLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال بارگذاری اکانت‌ها...
              </div>
            ) : accounts?.length ? (
              <div className="space-y-2">
                {accounts.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/50"
                  >
                    <div className="text-sm">
                      <div className="font-medium">
                        #{a.accountId} — {a.accountName || "بدون نام"}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="acc"
                      value={a.id}
                      checked={selectedGameAccountId === a.id}
                      onChange={() => setSelectedGameAccountId(a.id)}
                      className="h-4 w-4"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                اکانتی برای این بازی پیدا نشد.
              </div>
            )}
          </div>
        </div>

        {/* Add account (optional) */}
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <Label>افزودن اکانت جدید (اختیاری)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdd((s) => !s)}
            >
              <Plus className="w-4 h-4 ml-1" />
              {showAdd ? "بستن" : "افزودن"}
            </Button>
          </div>

          {showAdd && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 space-y-2">
                <Label htmlFor="acc-id">شناسه اکانت</Label>
                <Input
                  id="acc-id"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="مثلاً 12345"
                  value={newAccId}
                  onChange={(e) => setNewAccId(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="acc-name">نام اکانت</Label>
                <Input
                  id="acc-name"
                  placeholder="(اختیاری)"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <Button
                  type="button"
                  onClick={onAddAccount}
                  disabled={addAcc.isPending || !String(newAccId).replace(/\D+/g, "")}
                >
                  {addAcc.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال افزودن…
                    </>
                  ) : (
                    "ثبت اکانت"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button onClick={onSubmitOrder} disabled={!canSubmit}>
            {addOrder.isPending ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ثبت سفارش…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 ml-2" />
                ثبت سفارش
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

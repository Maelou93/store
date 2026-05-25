"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrder } from "@/hooks/use-order";
import { useCartStore } from "@/store/cart-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandWhatsapp,
  IconCheck,
  IconLock,
  IconPackage,
  IconShoppingBag,
  IconTruck,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const customerSchema = z
  .object({
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
    phone: z
      .string()
      .min(10, "Le téléphone doit contenir au moins 10 chiffres"),
    street: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    country: z.enum(["France", "Belgique"]),
    deliveryMethod: z
      .enum([
        "hand-delivery-aulnay",
        "hand-delivery-idf",
        "parcel-france-relais",
        "parcel-france-home",
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    const needsAddress =
      data.deliveryMethod === "parcel-france-relais" ||
      data.deliveryMethod === "parcel-france-home";
    if (needsAddress) {
      if (!data.street || data.street.length < 5)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "L'adresse doit contenir au moins 5 caractères",
          path: ["street"],
        });
      if (!data.postalCode || data.postalCode.length < 4)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le code postal est requis",
          path: ["postalCode"],
        });
      if (!data.city || data.city.length < 2)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La ville est requise",
          path: ["city"],
        });
    }
  });

type CustomerFormValues = z.infer<typeof customerSchema>;

const DELIVERY_OPTIONS = [
  {
    id: "hand-delivery-aulnay" as const,
    label: "Remise en main propre",
    description: "Sur Aulnay-sous-Bois",
    price: 0,
    priceLabel: "Gratuit",
    icon: IconPackage,
  },
  {
    id: "hand-delivery-idf" as const,
    label: "Livraison de main à main",
    description: "En Île-de-France (gratuite à partir de 180€)",
    price: 0,
    priceLabel: "Payant",
    icon: IconTruck,
  },
  {
    id: "parcel-france-relais" as const,
    label: "Point relais",
    description: "Dans toute la France",
    price: 5.0,
    priceLabel: "5,00 €",
    icon: IconPackage,
  },
  {
    id: "parcel-france-home" as const,
    label: "Livraison à domicile",
    description: "Dans toute la France",
    price: 8.9,
    priceLabel: "8,90 €",
    icon: IconTruck,
  },
];

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder, isLoading: orderLoading } = useOrder();

  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    discountId: string;
    discountCode: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      postalCode: "",
      city: "",
      country: "France",
      deliveryMethod: undefined,
    },
  });

  const orderNumber = useMemo(() => {
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `CMD-${timestamp}-${random}`;
    };
    return searchParams.get("order") || generateOrderNumber();
  }, [searchParams]);

  useEffect(() => {
    setIsMounted(true);
    const storedDiscount = localStorage.getItem("appliedDiscount");
    if (storedDiscount) {
      try {
        setAppliedDiscount(JSON.parse(storedDiscount));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (orderConfirmed) clearCart();
    };
    const handlePopstate = () => {
      if (orderConfirmed) clearCart();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
      if (orderConfirmed) clearCart();
    };
  }, [orderConfirmed, clearCart]);

  const selectedDelivery = DELIVERY_OPTIONS.find(
    (o) => o.id === form.watch("deliveryMethod"),
  );
  const deliveryFee = selectedDelivery?.price ?? 0;
  const needsAddress =
    form.watch("deliveryMethod") === "parcel-france-relais" ||
    form.watch("deliveryMethod") === "parcel-france-home";
  const subtotal = getTotalPrice();
  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const total = subtotal + deliveryFee - discountAmount;

  const formatOrderMessage = useCallback(() => {
    const formValues = form.getValues();
    const itemsList = items
      .map(
        (item) =>
          `• ${item.nom}${item.taille ? ` (Taille: ${item.taille})` : ""}${
            item.couleur ? ` (Couleur: ${item.couleur})` : ""
          } x${item.quantite} - ${(item.prix * item.quantite).toFixed(2)}€`,
      )
      .join("\n");

    const customerName = `${formValues.firstName} ${formValues.lastName}`;
    const fullAddress = `${formValues.street}\n${formValues.postalCode} ${formValues.city}\n${formValues.country}`;

    const deliveryMethodText =
      DELIVERY_OPTIONS.find((o) => o.id === formValues.deliveryMethod)?.label ??
      "";

    let message =
      `*Nouvelle Commande*\n\n` +
      `*Numéro: ${orderNumber}*\n\n` +
      `*Client:* ${customerName}\n` +
      `*Email:* ${formValues.email}\n` +
      `*Téléphone:* ${formValues.phone}\n` +
      `*Adresse:*\n${fullAddress}\n\n` +
      `*Articles commandés:*\n${itemsList}\n\n` +
      `*Sous-total:* ${subtotal.toFixed(2)}€\n`;

    if (deliveryFee > 0)
      message += `*Frais de livraison:* ${deliveryFee.toFixed(2)}€\n`;
    if (appliedDiscount)
      message += `*Réduction (${appliedDiscount.discountCode}):* -${appliedDiscount.discountAmount.toFixed(2)}€\n`;
    message += `*Total:* ${total.toFixed(2)}€\n`;
    if (deliveryMethodText)
      message += `\n*Mode de livraison:* ${deliveryMethodText}\n`;

    return message;
  }, [items, orderNumber, subtotal, deliveryFee, appliedDiscount, total, form]);

  const onSubmitCustomerInfo = async () => {
    setStep("confirmed");
  };

  const handleWhatsAppClick = async () => {
    setIsSavingOrder(true);
    try {
      const formValues = form.getValues();
      const customerName = `${formValues.firstName} ${formValues.lastName}`;

      const result = await createOrder(orderNumber, items, total, {
        name: customerName,
        email: formValues.email,
        phone: formValues.phone,
        street: formValues.street,
        postalCode: formValues.postalCode,
        city: formValues.city,
        country: formValues.country,
        deliveryMethod: formValues.deliveryMethod,
      });

      if (result) {
        setOrderConfirmed(true);
        localStorage.removeItem("appliedDiscount");
        toast.success("Commande sauvegardée ! Ouverture de WhatsApp...", {
          position: "top-center",
        });
        const message = encodeURIComponent(formatOrderMessage());
        setTimeout(() => {
          window.location.assign(`https://wa.me/+33759387212?text=${message}`);
        }, 1000);
      } else {
        toast.error("Erreur lors de la sauvegarde de la commande", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Erreur WhatsApp click:", err);
      toast.error("Erreur lors de la sauvegarde de la commande", {
        position: "top-center",
      });
    } finally {
      setIsSavingOrder(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#493A2E] via-[#6B5848] to-[#88755C]" />

      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-black uppercase tracking-tight text-[#6B5848]"
          >
            IW Store
          </Link>
          <div className="flex items-center gap-1.5 text-stone-500 text-xs">
            <IconLock className="w-3.5 h-3.5" />
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs text-stone-400">
          <Link href="/" className="hover:text-stone-700 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link
            href="/panier"
            className="hover:text-stone-700 transition-colors"
          >
            Panier
          </Link>
          <span>/</span>
          <span className="text-[#6B5848] font-medium">Confirmation</span>
        </nav>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          {/* ── LEFT: Form ── */}
          <div className="space-y-6">
            {/* Order number badge */}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${orderConfirmed ? "bg-green-500" : "bg-stone-900"}`}
              >
                {orderConfirmed ? (
                  <IconCheck className="w-4 h-4 text-white" />
                ) : (
                  <IconShoppingBag className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">
                  Commande
                </p>
                <p className="text-sm font-bold text-[#6B5848]">
                  #{orderNumber}
                </p>
              </div>
            </div>

            {step === "form" ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitCustomerInfo)}
                  className="space-y-6"
                >
                  {/* Contact */}
                  <section className="bg-white border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B5848]">
                      Informations de contact
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                              Nom *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Dupont"
                                className="h-11 rounded-none border-stone-300 focus:border-stone-900 focus:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                              Prénom *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jean"
                                className="h-11 rounded-none border-stone-300 focus:border-stone-900 focus:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                            Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="jean@example.com"
                              type="email"
                              className="h-11 rounded-none border-stone-300 focus:border-stone-900 focus:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                            Téléphone *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+33 6 12 34 56 78"
                              type="tel"
                              className="h-11 rounded-none border-stone-300 focus:border-stone-900 focus:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Mode de livraison */}
                  <section className="bg-white border border-stone-200 p-6 space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B5848]">
                      Mode de livraison
                    </h2>
                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              {DELIVERY_OPTIONS.map((option) => (
                                <label
                                  key={option.id}
                                  htmlFor={option.id}
                                  className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                                    field.value === option.id
                                      ? "border-stone-900 bg-stone-50"
                                      : "border-stone-200 hover:border-stone-400"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                    className="shrink-0"
                                  />
                                  <div className="flex-1">
                                    <span className="font-semibold text-[#6B5848] text-sm block">
                                      {option.label}
                                    </span>
                                    <span className="text-xs text-stone-500 block mt-0.5">
                                      {option.description}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-sm font-bold shrink-0 ${option.price === 0 ? "text-green-600" : "text-[#6B5848]"}`}
                                  >
                                    {option.priceLabel}
                                  </span>
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Adresse — visible uniquement pour Point relais / Domicile */}
                  {needsAddress && (
                    <section className="bg-white border border-stone-200 p-6 space-y-4">
                      <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B5848]">
                        Adresse de livraison
                      </h2>
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                              Adresse *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Rue de la Paix"
                                className="h-11 rounded-none border-stone-300 focus:border-stone-900 focus:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                                Code postal *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="75001"
                                  className="h-11 rounded-none border-stone-300 focus:border-stone-900 focus:ring-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                                Ville *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Paris"
                                  className="h-11 rounded-none border-stone-300 focus:border-stone-900 focus:ring-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-stone-600 uppercase tracking-wider">
                              Pays *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-none border-stone-300 focus:ring-0">
                                  <SelectValue placeholder="Sélectionner un pays" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="Belgique">
                                  Belgique
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </section>
                  )}

                  <button
                    type="submit"
                    disabled={
                      !form.formState.isValid || !form.watch("deliveryMethod")
                    }
                    className="w-full h-12 bg-stone-900 text-white text-sm font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
                  >
                    Confirmer mes informations →
                  </button>
                </form>
              </Form>
            ) : (
              /* Step 2: confirmed — show summary + WhatsApp */
              <div className="space-y-6">
                {/* Recap adresse */}
                <section className="bg-white border border-stone-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B5848] flex items-center gap-2">
                      <IconCheck className="w-4 h-4 text-green-600" />
                      Informations confirmées
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-xs text-stone-500 underline hover:text-[#6B5848] transition-colors"
                    >
                      Modifier
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">
                        Nom
                      </p>
                      <p className="text-[#6B5848] font-medium">
                        {form.getValues("firstName")}{" "}
                        {form.getValues("lastName")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">
                        Email
                      </p>
                      <p className="text-[#6B5848] font-medium">
                        {form.getValues("email")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">
                        Téléphone
                      </p>
                      <p className="text-[#6B5848] font-medium">
                        {form.getValues("phone")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">
                        Mode de livraison
                      </p>
                      <p className="text-[#6B5848] font-medium">
                        {selectedDelivery?.label}
                      </p>
                    </div>
                    {needsAddress && (
                      <div className="col-span-2">
                        <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">
                          Adresse
                        </p>
                        <p className="text-[#6B5848] font-medium">
                          {form.getValues("street")},{" "}
                          {form.getValues("postalCode")}{" "}
                          {form.getValues("city")}, {form.getValues("country")}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* WhatsApp CTA */}
                <section className="bg-white border border-stone-200 p-6 space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B5848]">
                    Finaliser la commande
                  </h2>
                  <p className="text-sm text-stone-500">
                    Cliquez sur le bouton ci-dessous pour envoyer votre commande
                    via WhatsApp. Votre récapitulatif sera automatiquement
                    pré-rempli.
                  </p>
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    disabled={isSavingOrder}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    <IconBrandWhatsapp className="w-5 h-5" />
                    {isSavingOrder
                      ? "Sauvegarde en cours..."
                      : "Finaliser avec WhatsApp"}
                  </button>

                  {/* Backup link */}
                  <p className="text-center text-xs text-stone-400">
                    Si le bouton ne fonctionne pas :{" "}
                    <a
                      href={`https://wa.me/+33759387212?text=${encodeURIComponent(formatOrderMessage())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline hover:text-green-800"
                      onClick={(e) => {
                        if (isSavingOrder) {
                          e.preventDefault();
                          return;
                        }
                        handleWhatsAppClick();
                      }}
                    >
                      ouvrir WhatsApp directement
                    </a>
                  </p>
                </section>

                <Link
                  href="/"
                  className="block text-center text-xs text-stone-400 hover:text-stone-700 transition-colors"
                >
                  ← Retourner à l&apos;accueil
                </Link>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order summary ── */}
          <aside className="lg:sticky lg:top-6 space-y-4">
            <div className="bg-white border border-stone-200">
              <div className="px-6 py-4 border-b border-stone-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B5848]">
                  Récapitulatif
                </h2>
              </div>

              {/* Items */}
              <div className="divide-y divide-stone-100">
                {items.length > 0 ? (
                  items.map((item) => {
                    const unitPrice =
                      item.prixReduit && item.prixReduit > 0
                        ? item.prixReduit
                        : item.prix;
                    return (
                      <div
                        key={item.id}
                        className="px-6 py-4 flex items-center gap-4"
                      >
                        <div className="relative shrink-0">
                          <div className="w-16 h-16 bg-stone-100 relative">
                            <Image
                              src={item.image}
                              alt={item.nom}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-stone-500 text-white text-xs flex items-center justify-center font-bold">
                            {item.quantite}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#6B5848] truncate">
                            {item.nom}
                          </p>
                          <div className="flex gap-2 mt-0.5">
                            {item.taille && (
                              <span className="text-xs text-stone-400">
                                {item.taille}
                              </span>
                            )}
                            {item.couleur && (
                              <span className="text-xs text-stone-400">
                                {item.couleur}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-[#6B5848] shrink-0">
                          {(unitPrice * item.quantite).toFixed(2)} €
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-8 text-center text-sm text-stone-400">
                    Chargement du panier...
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="px-6 py-4 border-t border-stone-200 space-y-2">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Livraison</span>
                  <span>
                    {selectedDelivery ? (
                      selectedDelivery.price === 0 ? (
                        <span className="text-green-600 font-medium">
                          Gratuit
                        </span>
                      ) : (
                        `${selectedDelivery.price.toFixed(2)} €`
                      )
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réduction ({appliedDiscount.discountCode})</span>
                    <span>-{appliedDiscount.discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#6B5848] pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-stone-400 text-right">TVA incluse</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white border border-stone-200 px-6 py-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <IconLock className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Informations sécurisées</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <IconTruck className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <IconBrandWhatsapp className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Support WhatsApp 7j/7</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-stone-500">Chargement...</div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

import { createFileRoute, useServerFn } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, PackageCheck, Sparkles } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

import logoAsset from "@/assets/first-zone-logo.jpg.asset.json";
import productsImage from "@/assets/first-zone-products.jpg";
import { Button } from "@/components/ui/button";
import { submitOrderRequest } from "@/lib/orders.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "اطلب طباعتك — First Zone" },
      { name: "description", content: "اطلب طباعة التيشيرتات والملابس للشركات والأفراد بسهولة مع First Zone." },
      { property: "og:title", content: "اطلب طباعتك — First Zone" },
      { property: "og:description", content: "طباعة ملابس احترافية للشركات والأفراد، من الفكرة حتى التسليم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const orderTypes = [
  { id: "company", title: "طلب شركة", text: "زي موحّد لفريقك أو فعاليتك", label: "ابدأ طلب شركتك", crop: "object-[18%_center]" },
  { id: "brand", title: "علامتك الخاصة", text: "أطلق مجموعتك بطباعة مميزة", label: "ابدأ مجموعتك", crop: "object-center" },
  { id: "individual", title: "طلب شخصي", text: "قطعة خاصة لك أو لمناسبتك", label: "صمّم قطعتك", crop: "object-[72%_center]" },
] as const;

type CustomerType = (typeof orderTypes)[number]["id"];

function Index() {
  const formRef = useRef<HTMLElement>(null);
  const submitOrder = useServerFn(submitOrderRequest);
  const [customerType, setCustomerType] = useState<CustomerType>("company");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const chooseType = (type: CustomerType) => {
    setCustomerType(type);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      await submitOrder({
        data: {
          customerType,
          customerName: String(form.get("name") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          productType: String(form.get("product") ?? ""),
          quantity: Number(form.get("quantity") ?? 1),
          printDetails: String(form.get("details") ?? ""),
        },
      });
      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="mx-auto flex h-24 max-w-6xl items-center justify-between px-5 sm:px-8">
        <img src={logoAsset.url} alt="First Zone" className="h-14 w-24 rounded-md object-cover object-center" />
        <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground sm:text-sm">
          <span className="hidden sm:inline">طباعة بجودة تصنع الفرق</span>
          <span className="h-2 w-2 rounded-full bg-brand-blue" />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-16">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold text-brand-blue"><Sparkles className="size-4" /> من فكرتك إلى قطعة تُلبس</p>
          <h1 className="text-4xl font-extrabold leading-[1.35] sm:text-6xl">لكل فكرة،<br />طبعتها الخاصة.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">اختر نوع طلبك، أخبرنا ما تريد، ونحن نهتم بالتفاصيل من الطباعة حتى التجهيز.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {orderTypes.map((type) => (
            <article key={type.id} className="group grid min-h-44 grid-cols-[42%_58%] overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm lg:min-h-64 lg:grid-cols-1 lg:grid-rows-[52%_48%]">
              <img src={productsImage} alt="ملابس جاهزة للطباعة" width={1024} height={1024} className={`h-full w-full object-cover ${type.crop}`} />
              <div className="flex flex-col justify-center p-5 lg:p-6">
                <h2 className="text-xl font-extrabold lg:text-2xl">{type.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{type.text}</p>
                <Button type="button" variant="link" onClick={() => chooseType(type.id)} className="mt-3 h-auto justify-start p-0 text-sm font-bold no-underline">
                  {type.label}<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </div>
            </article>
          ))}
        </div>
        <button type="button" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} aria-label="انتقل إلى نموذج الطلب" className="mx-auto mt-10 flex cursor-pointer flex-col items-center gap-2 text-xs text-muted-foreground">
          ابدأ الطلب الآن <ChevronDown className="size-5 animate-bounce" />
        </button>
      </section>

      <section ref={formRef} className="bg-surface-strong px-5 py-16 text-primary-foreground sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="inline-flex rounded-full border border-primary-foreground/20 px-4 py-2 text-xs font-semibold">طلب جديد</span>
            <h2 className="mt-6 text-3xl font-extrabold leading-[1.45] sm:text-5xl">أخبرنا ماذا<br />تريد أن نطبع.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/65">املأ التفاصيل الأساسية وسيراجع فريق First Zone طلبك.</p>
            <div className="mt-10 space-y-4 text-sm text-primary-foreground/80">
              {["طباعة للشركات والأفراد", "كميات صغيرة وكبيرة", "تنفيذ حسب التصميم المطلوب"].map((item) => <p key={item} className="flex items-center gap-3"><Check className="size-4 text-brand-blue" />{item}</p>)}
            </div>
          </div>

          {status === "success" ? (
            <div className="flex min-h-[30rem] flex-col items-center justify-center rounded-[1.5rem] bg-card p-8 text-center text-card-foreground">
              <span className="grid size-16 place-items-center rounded-full bg-accent text-primary"><PackageCheck className="size-8" /></span>
              <h3 className="mt-6 text-2xl font-extrabold">وصلنا طلبك</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">تم حفظ التفاصيل بنجاح، وسيتم التواصل معك لاستكمال الطلب.</p>
              <Button className="mt-7" onClick={() => setStatus("idle")}>إرسال طلب آخر</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[1.5rem] bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
              <div className="mb-7 grid grid-cols-3 gap-2 rounded-xl bg-muted p-1.5">
                {orderTypes.map((type) => <Button key={type.id} type="button" variant={customerType === type.id ? "default" : "ghost"} onClick={() => setCustomerType(type.id)} className="h-11 px-2 text-xs sm:text-sm">{type.title}</Button>)}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="الاسم أو اسم الشركة" name="name" placeholder="الاسم الكامل" required />
                <Field label="رقم الهاتف" name="phone" type="tel" placeholder="رقم للتواصل" required />
                <Field label="البريد الإلكتروني" name="email" type="email" placeholder="اختياري" />
                <label className="grid gap-2 text-sm font-semibold">نوع القطعة
                  <select name="product" required className="h-12 rounded-lg border border-input bg-background px-4 font-normal outline-none focus:border-primary">
                    <option value="تيشيرت">تيشيرت</option><option value="هودي">هودي</option><option value="بولو">بولو</option><option value="ملابس عمل">ملابس عمل</option><option value="أخرى">أخرى</option>
                  </select>
                </label>
                <Field label="الكمية" name="quantity" type="number" placeholder="مثال: 25" min="1" required />
                <label className="grid gap-2 text-sm font-semibold sm:col-span-2">تفاصيل الطباعة
                  <textarea name="details" required rows={4} placeholder="الألوان، أماكن الطباعة، المقاسات وأي تفاصيل أخرى..." className="resize-none rounded-lg border border-input bg-background px-4 py-3 font-normal leading-7 outline-none focus:border-primary" />
                </label>
              </div>
              {status === "error" && <p role="alert" className="mt-5 text-sm font-semibold text-destructive">تعذر إرسال الطلب. تحقق من المعلومات وحاول مرة أخرى.</p>}
              <Button type="submit" size="lg" disabled={status === "sending"} className="mt-7 h-13 w-full text-base font-bold">{status === "sending" ? "جارٍ الإرسال..." : "إرسال طلب الطباعة"}<ArrowLeft /></Button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-surface-strong px-5 pb-8 text-center text-xs text-primary-foreground/50">FIRST ZONE — طباعة بهوية أقوى</footer>
    </main>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input {...props} className="h-12 rounded-lg border border-input bg-background px-4 font-normal outline-none focus:border-primary" /></label>;
}
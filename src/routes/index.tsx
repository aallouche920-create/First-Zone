import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, ChevronDown, PackageCheck, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import heroVideoAsset from "@/assets/first-zone-hero.mp4.asset.json";
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
  { id: "company", crop: "object-[18%_center]" },
  { id: "brand", crop: "object-center" },
  { id: "individual", crop: "object-[72%_center]" },
] as const;

type CustomerType = (typeof orderTypes)[number]["id"];
type Language = "ar" | "fr" | "en";

const translations = {
  ar: {
    tagline: "طباعة بجودة تصنع الفرق",
    languageLabel: "اختر اللغة",
    eyebrow: "من فكرتك إلى قطعة تُلبس",
    trustedTitle: "شركات وثقت بنا",
    trustedSubtitle: "علامات وشركات اختارت First Zone لطباعة ملابسها",
    title: <>لكل فكرة،<br />طبعتها الخاصة.</>,
    intro: "اختر نوع طلبك، أخبرنا ما تريد، ونحن نهتم بالتفاصيل من الطباعة حتى التجهيز.",
    productImageAlt: "ملابس جاهزة للطباعة",
    orderTypes: {
      company: { title: "طلب شركة", text: "زي موحّد لفريقك أو فعاليتك", label: "ابدأ طلب شركتك" },
      brand: { title: "علامتك الخاصة", text: "أطلق مجموعتك بطباعة مميزة", label: "ابدأ مجموعتك" },
      individual: { title: "طلب شخصي", text: "قطعة خاصة لك أو لمناسبتك", label: "صمّم قطعتك" },
    },
    startNow: "ابدأ الطلب الآن",
    newOrder: "طلب جديد",
    formTitle: <>أخبرنا ماذا<br />تريد أن نطبع.</>,
    formIntro: "املأ التفاصيل الأساسية وسيراجع فريق First Zone طلبك.",
    benefits: ["طباعة للشركات والأفراد", "كميات صغيرة وكبيرة", "تنفيذ حسب التصميم المطلوب"],
    successTitle: "وصلنا طلبك",
    successText: "تم حفظ التفاصيل بنجاح، وسيتم التواصل معك لاستكمال الطلب.",
    anotherOrder: "إرسال طلب آخر",
    name: "الاسم أو اسم الشركة",
    namePlaceholder: "الاسم الكامل",
    phone: "رقم الهاتف",
    phonePlaceholder: "رقم للتواصل",
    email: "البريد الإلكتروني",
    optional: "اختياري",
    product: "نوع القطعة",
    productOptions: ["تيشيرت", "هودي", "بولو", "ملابس عمل", "أخرى"],
    quantity: "الكمية",
    quantityPlaceholder: "مثال: 25",
    details: "تفاصيل الطباعة",
    detailsPlaceholder: "الألوان، أماكن الطباعة، المقاسات وأي تفاصيل أخرى...",
    error: "تعذر إرسال الطلب. تحقق من المعلومات وحاول مرة أخرى.",
    sending: "جارٍ الإرسال...",
    submit: "إرسال طلب الطباعة",
    footer: "FIRST ZONE — طباعة بهوية أقوى",
  },
  fr: {
    tagline: "Une impression qui fait la différence",
    languageLabel: "Choisir la langue",
    eyebrow: "De votre idée à une pièce à porter",
    trustedTitle: "Ils nous font confiance",
    trustedSubtitle: "Des marques et entreprises qui ont choisi First Zone",
    title: <>Chaque idée<br />mérite son impression.</>,
    intro: "Choisissez votre type de commande, décrivez votre projet et nous nous occupons de tout, de l’impression à la préparation.",
    productImageAlt: "Vêtements prêts à imprimer",
    orderTypes: {
      company: { title: "Entreprise", text: "Tenues pour votre équipe ou événement", label: "Démarrer votre commande" },
      brand: { title: "Votre marque", text: "Lancez votre collection personnalisée", label: "Créer votre collection" },
      individual: { title: "Particulier", text: "Une pièce unique pour vous ou un événement", label: "Créer votre pièce" },
    },
    startNow: "Commander maintenant",
    newOrder: "Nouvelle commande",
    formTitle: <>Dites-nous ce que<br />vous souhaitez imprimer.</>,
    formIntro: "Renseignez les informations essentielles. L’équipe First Zone étudiera votre demande.",
    benefits: ["Impression pour entreprises et particuliers", "Petites et grandes quantités", "Réalisation selon votre design"],
    successTitle: "Demande reçue",
    successText: "Vos informations ont bien été enregistrées. Nous vous contacterons pour finaliser la commande.",
    anotherOrder: "Envoyer une autre demande",
    name: "Nom ou entreprise",
    namePlaceholder: "Nom complet",
    phone: "Téléphone",
    phonePlaceholder: "Numéro de contact",
    email: "E-mail",
    optional: "Facultatif",
    product: "Type de vêtement",
    productOptions: ["T-shirt", "Sweat à capuche", "Polo", "Vêtement de travail", "Autre"],
    quantity: "Quantité",
    quantityPlaceholder: "Exemple : 25",
    details: "Détails d’impression",
    detailsPlaceholder: "Couleurs, emplacements, tailles et autres détails...",
    error: "Impossible d’envoyer la demande. Vérifiez les informations et réessayez.",
    sending: "Envoi en cours...",
    submit: "Envoyer la demande",
    footer: "FIRST ZONE — UNE IDENTITÉ PLUS FORTE PAR L’IMPRESSION",
  },
  en: {
    tagline: "Quality printing that makes a difference",
    languageLabel: "Choose language",
    eyebrow: "From your idea to something you can wear",
    trustedTitle: "Trusted by",
    trustedSubtitle: "Brands and companies that chose First Zone",
    title: <>Every idea deserves<br />its own print.</>,
    intro: "Choose your order type, tell us what you need, and we’ll handle every detail from printing to preparation.",
    productImageAlt: "Garments ready for printing",
    orderTypes: {
      company: { title: "Business", text: "Uniforms for your team or event", label: "Start a business order" },
      brand: { title: "Your brand", text: "Launch your own printed collection", label: "Start your collection" },
      individual: { title: "Personal", text: "A unique piece for you or your occasion", label: "Create your piece" },
    },
    startNow: "Start your order",
    newOrder: "New order",
    formTitle: <>Tell us what<br />you want printed.</>,
    formIntro: "Share the essentials and the First Zone team will review your request.",
    benefits: ["Printing for businesses and individuals", "Small and large quantities", "Produced to match your design"],
    successTitle: "We received your request",
    successText: "Your details were saved successfully. We’ll contact you to complete the order.",
    anotherOrder: "Send another request",
    name: "Name or company name",
    namePlaceholder: "Full name",
    phone: "Phone number",
    phonePlaceholder: "Contact number",
    email: "Email address",
    optional: "Optional",
    product: "Garment type",
    productOptions: ["T-shirt", "Hoodie", "Polo", "Workwear", "Other"],
    quantity: "Quantity",
    quantityPlaceholder: "Example: 25",
    details: "Printing details",
    detailsPlaceholder: "Colors, print placement, sizes, and any other details...",
    error: "We couldn’t send your request. Check the information and try again.",
    sending: "Sending...",
    submit: "Send printing request",
    footer: "FIRST ZONE — PRINT A STRONGER IDENTITY",
  },
} as const;

const languageOptions: { id: Language; label: string }[] = [
  { id: "ar", label: "العربية" },
  { id: "fr", label: "Français" },
  { id: "en", label: "English" },
];

const trustedSlots = Array.from({ length: 10 }, (_, index) => index);

function Index() {
  const formRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const form = formRef.current;
    if (!video || !form) return;
    let raf = 0;
    let current = 0;
    let last = performance.now();
    let end = 1;
    const measure = () => {
      end = Math.max(1, form.getBoundingClientRect().top + window.scrollY - window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;
      const duration = video.duration;
      if (!duration || video.readyState < 1) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / end));
      const target = progress * (duration - 0.05);
      const diff = target - current;
      if (Math.abs(diff) < 0.001) return;
      // frame-rate independent easing for buttery motion
      current += diff * (1 - Math.exp(-dt / 140));
      if (!video.seeking) video.currentTime = current;
    };
    video.load();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const submitOrder = useServerFn(submitOrderRequest);
  const [language, setLanguage] = useState<Language>("ar");
  const [customerType, setCustomerType] = useState<CustomerType>("company");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const copy = translations[language];
  const isRtl = language === "ar";

  const chooseType = (type: CustomerType) => {
    setCustomerType(type);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    const form = new FormData(formElement);
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
      formElement.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main lang={language} dir={isRtl ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <video ref={videoRef} src="/videos/hero-scrub.mp4" muted playsInline preload="auto" disablePictureInPicture className="h-full w-full object-cover [transform:translateZ(0)] [will-change:transform]" />
        <div className="absolute inset-0 bg-background/25" />
      </div>
      <header className="mx-auto flex min-h-24 max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <img src={logoAsset.url} alt="First Zone" className="h-14 w-24 rounded-md object-cover object-center" />
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold text-muted-foreground lg:inline">{copy.tagline}</span>
          <div role="group" aria-label={copy.languageLabel} className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
            {languageOptions.map((option) => (
              <Button key={option.id} type="button" size="sm" variant={language === option.id ? "default" : "ghost"} onClick={() => setLanguage(option.id)} lang={option.id} className="h-8 px-2.5">
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[85vh] items-center">
          <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="max-w-3xl rounded-[1.5rem] bg-background/55 p-6 backdrop-blur-md sm:p-8">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-brand-blue"><Sparkles className="size-4" />{copy.eyebrow}</p>
              <h1 className="text-4xl font-extrabold leading-[1.35] sm:text-6xl">{copy.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-foreground/80 sm:text-lg">{copy.intro}</p>
            </div>
          </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-16">


        <div className="grid gap-4 lg:grid-cols-3">
          {orderTypes.map((type) => (
            <article key={type.id} className="group grid min-h-44 grid-cols-[42%_58%] overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm lg:min-h-64 lg:grid-cols-1 lg:grid-rows-[52%_48%]">
              <img src={productsImage} alt={copy.productImageAlt} width={1024} height={1024} className={`h-full w-full object-cover ${type.crop}`} />
              <div className="flex flex-col justify-center p-5 lg:p-6">
                <h2 className="text-xl font-extrabold lg:text-2xl">{copy.orderTypes[type.id].title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.orderTypes[type.id].text}</p>
                <Button type="button" variant="link" onClick={() => chooseType(type.id)} className="mt-3 h-auto justify-start p-0 text-sm font-bold no-underline">
                  {copy.orderTypes[type.id].label}<ArrowLeft className={`size-4 transition-transform ${isRtl ? "group-hover:-translate-x-1" : "rotate-180 group-hover:translate-x-1"}`} />
                </Button>
              </div>
            </article>
          ))}
        </div>
        <Button type="button" variant="ghost" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} aria-label={copy.startNow} className="mx-auto mt-10 flex h-auto flex-col items-center gap-2 text-xs text-muted-foreground">
          {copy.startNow}<ChevronDown className="size-5 animate-bounce" />
        </Button>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto mb-9 max-w-6xl px-5 text-center sm:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{copy.trustedTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">{copy.trustedSubtitle}</p>
        </div>
        <div dir="ltr" className="marquee-fade overflow-hidden">
          <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
            {[0, 1].map((half) => (
              <div key={half} aria-hidden={half === 1} className="flex">
                {trustedSlots.map((slot) => (
                  <div key={slot} className="mx-3 grid h-24 w-40 shrink-0 place-items-center rounded-[1.25rem] border border-border bg-card shadow-sm sm:h-28 sm:w-52">
                    {/* شعار العميل يوضع هنا لاحقًا */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={formRef} className="bg-surface-strong px-5 py-16 text-primary-foreground sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="inline-flex rounded-full border border-primary-foreground/20 px-4 py-2 text-xs font-semibold">{copy.newOrder}</span>
            <h2 className="mt-6 text-3xl font-extrabold leading-[1.45] sm:text-5xl">{copy.formTitle}</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/65">{copy.formIntro}</p>
            <div className="mt-10 space-y-4 text-sm text-primary-foreground/80">
              {copy.benefits.map((item) => <p key={item} className="flex items-center gap-3"><Check className="size-4 text-brand-blue" />{item}</p>)}
            </div>
          </div>

          {status === "success" ? (
            <div className="flex min-h-[30rem] flex-col items-center justify-center rounded-[1.5rem] bg-card p-8 text-center text-card-foreground">
              <span className="grid size-16 place-items-center rounded-full bg-accent text-primary"><PackageCheck className="size-8" /></span>
              <h3 className="mt-6 text-2xl font-extrabold">{copy.successTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy.successText}</p>
              <Button className="mt-7" onClick={() => setStatus("idle")}>{copy.anotherOrder}</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[1.5rem] bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
              <div className="mb-7 grid grid-cols-3 gap-2 rounded-xl bg-muted p-1.5">
                {orderTypes.map((type) => <Button key={type.id} type="button" variant={customerType === type.id ? "default" : "ghost"} onClick={() => setCustomerType(type.id)} className="h-11 px-2 text-xs sm:text-sm">{copy.orderTypes[type.id].title}</Button>)}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={copy.name} name="name" placeholder={copy.namePlaceholder} required />
                <Field label={copy.phone} name="phone" type="tel" placeholder={copy.phonePlaceholder} required />
                <Field label={copy.email} name="email" type="email" placeholder={copy.optional} />
                <label className="grid gap-2 text-sm font-semibold">{copy.product}
                  <select name="product" required className="h-12 rounded-lg border border-input bg-background px-4 font-normal outline-none focus:border-primary">
                    {copy.productOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <Field label={copy.quantity} name="quantity" type="number" placeholder={copy.quantityPlaceholder} min="1" required />
                <label className="grid gap-2 text-sm font-semibold sm:col-span-2">{copy.details}
                  <textarea name="details" required rows={4} placeholder={copy.detailsPlaceholder} className="resize-none rounded-lg border border-input bg-background px-4 py-3 font-normal leading-7 outline-none focus:border-primary" />
                </label>
              </div>
              {status === "error" && <p role="alert" className="mt-5 text-sm font-semibold text-destructive">{copy.error}</p>}
              <Button type="submit" size="lg" disabled={status === "sending"} className="mt-7 h-13 w-full text-base font-bold">{status === "sending" ? copy.sending : copy.submit}<ArrowLeft className={isRtl ? "" : "rotate-180"} /></Button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-surface-strong px-5 pb-8 text-center text-xs text-primary-foreground/50">{copy.footer}</footer>
    </main>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input {...props} className="h-12 rounded-lg border border-input bg-background px-4 font-normal outline-none focus:border-primary" /></label>;
}
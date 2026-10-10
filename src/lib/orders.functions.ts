import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderSchema = z.object({
  customerType: z.enum(["company", "individual", "brand"]),
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(160).or(z.literal("")),
  productType: z.string().trim().min(2).max(80),
  quantity: z.number().int().min(1).max(100000),
  printDetails: z.string().trim().min(5).max(2000),
  logo: z
    .object({
      name: z.string().trim().min(1).max(200),
      type: z.enum(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]),
      dataUrl: z.string().startsWith("data:image/").max(14_000_000),
    })
    .optional(),
});

const extensionByType: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export const submitOrderRequest = createServerFn({ method: "POST" })
  .validator((input) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let logoPath: string | null = null;
    if (data.logo) {
      const base64 = data.logo.dataUrl.split(",")[1] ?? "";
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      if (bytes.byteLength > 10 * 1024 * 1024) throw new Error("حجم الصورة كبير جدًا.");
      const ext = extensionByType[data.logo.type] ?? "png";
      logoPath = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("order-logos")
        .upload(logoPath, bytes, { contentType: data.logo.type });
      if (uploadError) throw new Error("تعذر رفع الصورة الآن. يرجى المحاولة مرة أخرى.");
    }

    const { error } = await supabaseAdmin.from("order_requests").insert({
      customer_type: data.customerType,
      customer_name: data.customerName,
      phone: data.phone,
      email: data.email || null,
      product_type: data.productType,
      quantity: data.quantity,
      print_details: data.printDetails,
      logo_path: logoPath,
    });

    if (error) throw new Error("تعذر إرسال الطلب الآن. يرجى المحاولة مرة أخرى.");
    return { success: true };
  });

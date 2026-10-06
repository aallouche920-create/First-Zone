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
});

export const submitOrderRequest = createServerFn({ method: "POST" })
  .inputValidator((input) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("order_requests").insert({
      customer_type: data.customerType,
      customer_name: data.customerName,
      phone: data.phone,
      email: data.email || null,
      product_type: data.productType,
      quantity: data.quantity,
      print_details: data.printDetails,
    });

    if (error) throw new Error("تعذر إرسال الطلب الآن. يرجى المحاولة مرة أخرى.");
    return { success: true };
  });
CREATE TABLE public.order_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_type TEXT NOT NULL CHECK (customer_type IN ('company', 'individual', 'brand')),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  print_details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'quoted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.order_requests TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_requests TO service_role;
ALTER TABLE public.order_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an order request"
ON public.order_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'new');
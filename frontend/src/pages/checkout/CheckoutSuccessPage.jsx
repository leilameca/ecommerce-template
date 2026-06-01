import { useSearchParams, Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-zinc-200/80 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Payment successful!</h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          Your payment has been confirmed and your order is being processed.
        </p>

        {orderId ? (
          <p className="mt-2 text-xs text-zinc-400">
            Order reference: <span className="font-medium text-zinc-700">{orderId}</span>
          </p>
        ) : null}

        <div className="mt-8">
          <Link to={ROUTE_PATHS.catalog}>
            <Button size="lg" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

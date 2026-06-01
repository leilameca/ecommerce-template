import { useSearchParams, Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function CheckoutCancelPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-zinc-200/80 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
          <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Payment cancelled</h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          Your payment was not completed. Your order has been saved — you can try again.
        </p>

        {orderId ? (
          <p className="mt-2 text-xs text-zinc-400">
            Order reference: <span className="font-medium text-zinc-700">{orderId}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <Link to={ROUTE_PATHS.checkout}>
            <Button size="lg" className="w-full">Try Again</Button>
          </Link>
          <Link to={ROUTE_PATHS.catalog}>
            <Button variant="secondary" size="lg" className="w-full">Back to Catalog</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

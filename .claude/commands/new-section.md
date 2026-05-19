Create a new private dashboard section called: $ARGUMENTS

Follow these steps exactly:

## 1. Page
Create `app/w/[section]/page.tsx` as a `"use client"` component with:
- `<h1 className="font-caveat mb-1" style={{ fontSize: 48, color: "var(--ink)" }}>` heading
- A subtitle `<p className="text-sm mb-6" style={{ color: "var(--dim)" }}>`
- `useState` + `useEffect` to load data from `/api/[section]`
- Standard loading state: `<p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>Loading…</p>`
- Standard empty state: `<p className="text-sm py-8 text-center" style={{ color: "var(--dim)" }}>No items yet.</p>`
- Cards with `rounded-2xl p-5` and `border: "1px solid var(--line)"`

## 2. API proxy routes
Create `app/api/[section]/route.ts`:
```ts
import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function GET() {
  return proxy(await apiFetch("/[section]"));
}

export async function POST(req: NextRequest) {
  return proxy(await apiFetch("/[section]", { method: "POST", body: await req.text() }));
}
```

Create `app/api/[section]/[id]/route.ts`:
```ts
import { NextRequest } from "next/server";
import { apiFetch, proxy } from "@/lib/api";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(await apiFetch(`/[section]/${id}`, { method: "PATCH", body: await req.text() }));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(await apiFetch(`/[section]/${id}`, { method: "DELETE" }));
}
```

## 3. Sidebar
In `components/Sidebar.tsx`:
- Import a fitting icon from `lucide-react`
- Add to the `privateNav` array: `{ href: "/w/[section]", label: "[Label]", Icon: [Icon] }`
- Place it in a logical position relative to existing items

## 4. Reminder
Tell the user: "If this section needs a new backend route or schema model, arlind-api must be updated and redeployed too."

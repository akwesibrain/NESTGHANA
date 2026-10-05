# App and config explained

## `app\layout.tsx`
This file is like the front door and main walls of a house.

```tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
```
Very simply: `import` means “bring this tool into the room so we can use it.” `type` means we are only borrowing shape rules, not real running code. `Metadata` and `Viewport` are labels Next.js understands for page information. `ReactNode` means “anything React can show on the screen.” `"./globals.css"` brings in the big shared style sheet, like painting all the rooms before people walk in.

```tsx
export const metadata: Metadata = {
```
`export` means “share this so Next.js can use it somewhere else.” `const` means this value should stay the same. `metadata` is the page info card, like a name tag on the house.

```tsx
  title: {
    default: "NestGH — Find your next room",
    template: "%s | NestGH",
  },
```
This sets the page title. The `default` title is the usual name on the door. The `template` is like saying, “when a room has its own name, put it before `| NestGH`.”

```tsx
  description: "Find available rooms and student hostels in Ghana. Clear pricing, current availability, and direct contact with owners.",
  referrer: "no-referrer",
  icons: { icon: "/logo-192.png", apple: "/logo-192.png" },
};
```
The `description` is the little summary search engines may read. `referrer` controls whether the browser tells another site where the visitor came from; `no-referrer` means “tell them nothing.” `icons` picks the small picture for tabs and Apple devices.

```tsx
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ee",
};
```
The `viewport` is like telling the browser how to fit the page onto the screen. `device-width` says “match the screen width.” `initialScale: 1` means “start at normal zoom.” `themeColor` gives the browser a matching color, like choosing the color of the welcome mat.

```tsx
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
```
`default` means this is the main thing the file gives away. A `function` is a reusable mini-machine. `RootLayout` is the machine name. `children` means “whatever page content gets placed inside.” `Readonly` means “look, but do not change.”

```tsx
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```
`return` means “here is what to show.” This is `JSX`, which is code that looks like HTML so React can describe the page. `lang="en"` tells the browser the page is in English. The `<body>` is the main room of the page, and `{children}` is where each page gets placed, like swapping different toys onto the same play mat.

## `app\page.tsx`
This file is like a hallway sign that points everyone to the real room.

```tsx
import { redirect } from "next/navigation";
```
This `import` brings in `redirect`, which is a helper that sends a visitor somewhere else, like a teacher saying, “Wrong classroom — go next door.”

```tsx
export default function Home() {
```
This makes the main page component. A `component` is a building block for the screen, like one LEGO piece that becomes part of the house.

```tsx
  redirect("/index.html");
}
```
When this page runs, it immediately sends the visitor to `/index.html`. So this file does not build a page by itself; it acts like a door sign that says, “Please use this other entrance.”

## `app\list-room\page.tsx`
This file is like a small note on a bedroom door telling owners what this room is for.

```tsx
import Link from "next/link";
```
This brings in `Link`, which makes in-app links. Think of it like an indoor hallway door instead of jumping out a window.

```tsx
export const metadata = { title: "List your room" };
```
This gives this page its own title, like putting a label on one classroom.

```tsx
export default function ListRoomPage() {
  return (
```
This starts the page component and says it will return page content.

```tsx
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">For property owners</p>
```
`<main>` is the main content area. `className` is a styling label, like putting matching stickers on things so CSS knows what to decorate. The logo link takes people back home. The eyebrow text is a tiny label above the big title, like a small sticky note above a poster.

```tsx
      <h1>List your room</h1>
      <p>Secure listing submissions and payments are not available on this staging site yet. Please do not send personal details or payment.</p>
```
`<h1>` is the biggest page heading. The paragraph explains that this is only a staging site, which means a practice version, not the full live shop.

```tsx
      <Link className="info-link" href="/">Return to room search</Link>
    </main>
  );
}
```
This adds a simple way back to the main search page and closes the page structure.

## `app\privacy\page.tsx`
This file is like the house rule poster on the wall.

```tsx
import Link from "next/link";
```
Again, this brings in the safe indoor link helper.

```tsx
export const metadata = { title: "Privacy notice" };
```
This labels the page title as “Privacy notice.”

```tsx
export default function PrivacyPage() {
  return (
```
This begins the privacy page component.

```tsx
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">Your information</p>
      <h1>Privacy notice</h1>
```
This builds the top of the page: the main content box, the home link, a small label, and the big page title.

```tsx
      <p>NestGH is preparing its secure listing-submission service. This staging website currently lets visitors browse published listings; owner submissions and payments are not enabled.</p>
```
This paragraph explains what the site can do right now: people can look at listings, but owners cannot yet submit listings or payments here.

```tsx
      <h2>Browser storage</h2>
      <p>The cookie preference control stores your choice in this browser. Optional analytics and advertising cookies are not currently active. Essential authentication storage is used only when an administrator signs in.</p>
```
`<h2>` is a smaller heading, like a chapter title inside the same book. This part explains that cookie choices are stored in the browser, and only important admin sign-in storage is used.

```tsx
      <h2>Contact</h2>
      <p>Do not submit personal or payment information through this staging website. Contact the NestGH team through its official public channels for privacy questions.</p>
```
This section warns people not to send sensitive details here and tells them to use official contact places instead.

```tsx
      <Link className="info-link" href="/">Return to NestGH</Link>
    </main>
  );
}
```
This gives a path back home and closes the page.

## `app\components\cookie-consent.tsx`
This file is like a little light-switch panel that asks, “Do you want this extra thing on or off?”

```tsx
"use client";
```
This tells Next.js that this file must run in the browser. It is like saying, “this toy only works in the child’s hands, not in the storage room.”

```tsx
import { useState, useSyncExternalStore } from "react";
```
`useState` is a React hook, which is a special helper for remembering things in a component. `useSyncExternalStore` is another hook that keeps React lined up with outside data, like checking the same noticeboard everyone else uses.

```tsx
type Choice = "accepted" | "rejected";
const storageKey = "nestgh_cookie_consent_v1";
const listeners = new Set<() => void>();
let sessionChoice: Choice | null = null;
```
`Choice` says the allowed answers are only `accepted` or `rejected`. `storageKey` is the label used in browser storage, like the name on a lunch box. `listeners` is a set of watchers; a `Set` holds items without duplicates. `sessionChoice` remembers the current answer while the page is open.

```tsx
function getChoice(): Choice | null {
  try {
    const saved = localStorage.getItem(storageKey);
```
This starts a helper that reads the saved choice. `try` means “attempt this carefully.” `localStorage` is the browser’s tiny cupboard for saving little bits of data.

```tsx
    if (saved) {
      const value = JSON.parse(saved) as { choice?: unknown };
      if (value.choice === "accepted" || value.choice === "rejected") return value.choice;
    }
```
If something was saved, the code opens the text and turns it back into data with `JSON.parse`. `JSON` is a common way to pack data into text, like putting toys into labeled boxes. Then it checks that the saved answer is one of the two allowed choices.

```tsx
  } catch (error) {
    console.error("cookie_consent_read_failed", error);
  }
  return sessionChoice;
}
```
`catch` means “if something went wrong, handle it here.” The error is logged for debugging, and if saved storage fails, the code falls back to the in-memory session answer.

```tsx
function subscribe(listener: () => void) {
  listeners.add(listener);
```
This helper lets React sign up a watcher function. `subscribe` means “tell me when something changes.”

```tsx
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) sessionChoice = null;
    listener();
  }
```
When browser storage changes, this runs. If the changed key is the cookie-consent key, or all storage changed, it clears the session copy and tells React to check again.

```tsx
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
```
`window` means the browser window. `addEventListener` means “listen for this kind of event.” The returned function is cleanup: it removes the watcher later, like taking down a temporary sign after school ends.

```tsx
function notify() {
  listeners.forEach((listener) => listener());
}
```
This tells every watcher, “Hey, something changed.” `forEach` means “do this for each item.”

```tsx
export function CookieConsent() {
  const choice = useSyncExternalStore(subscribe, getChoice, () => null);
  const [storageError, setStorageError] = useState(false);
```
This starts the cookie banner component. It reads the current choice from the outside store and also remembers whether saving failed. The square-bracket pattern is React’s way of getting a value and the button that changes it.

```tsx
  function saveChoice(value: Choice) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ choice: value, updatedAt: new Date().toISOString() }));
      setStorageError(false);
```
This helper saves a choice. `setItem` writes to browser storage. `JSON.stringify` packs data into text. `new Date().toISOString()` makes a timestamp, like writing the exact day and time on a note.

```tsx
    } catch (error) {
      console.error("cookie_consent_save_failed", error);
      setStorageError(true);
    }
    sessionChoice = value;
    notify();
  }
```
If saving fails, it records an error state. Either way, it updates the session copy and tells all watchers to refresh.

```tsx
  function reopen() {
    try {
      localStorage.removeItem(storageKey);
```
This helper reopens the choice box by deleting the saved answer.

```tsx
    } catch (error) {
      console.error("cookie_consent_reset_failed", error);
      setStorageError(true);
    }
    sessionChoice = null;
    notify();
  }
```
If removing fails, it marks an error. Then it clears the current answer and tells the page to update.

```tsx
  return (
    <>
      {choice === null ? (
```
The component now decides what to show. `<>...</>` is a React fragment, which is like an invisible box that groups things without adding extra HTML. `choice === null` means “no answer has been chosen yet.”

```tsx
        <aside className="cookie-consent" aria-label="Cookie preferences">
          <div>
            <strong>Your privacy matters</strong>
            <p>We use essential browser storage where needed. Optional analytics and advertising cookies are not active.</p>
            <a href="/privacy">Read our privacy notice</a>
```
If there is no saved answer, it shows a side notice. `aside` is extra helper content, like a note pinned beside the main board. `aria-label` gives assistive technology a clear name. The text explains the cookie situation and links to the privacy page.

```tsx
            {storageError ? <p role="alert">Your choice may not be saved in this browser.</p> : null}
          </div>
```
This shows an error message only when saving failed. `role="alert"` tells assistive tools that this message matters right away.

```tsx
          <div className="cookie-consent-actions">
            <button type="button" className="cookie-reject" onClick={() => saveChoice("rejected")}>Reject</button>
            <button type="button" className="cookie-accept" onClick={() => saveChoice("accepted")}>Accept cookies</button>
          </div>
        </aside>
      ) : null}
```
Here are the two buttons. `onClick` means “run this when someone clicks.” One button says no, and the other says yes.

```tsx
      <button className="cookie-settings" type="button" onClick={reopen}>Cookie settings</button>
    </>
  );
}
```
This button is always shown, so a person can open the choice again later, like going back to a light switch after first picking on or off.

## `proxy.ts`
This file is like a careful security guard standing at the front gate.

```tsx
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
```
The first `import` brings in a Supabase helper for making a server-side client. The second brings in `NextResponse`, which is the outgoing reply, and `NextRequest`, which is the incoming letter from the browser.

```tsx
export async function proxy(request: NextRequest) {
```
`async` means this function may need to wait for something, like a child waiting for toast to pop up. `proxy` here is a middle helper that touches the request before the rest of the app uses it.

```tsx
  const nonce = btoa(crypto.randomUUID());
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secure = process.env.NODE_ENV === "production";
```
A `nonce` is a one-time random tag, like a secret wristband used only once so the wrong scripts cannot sneak in. `process.env` means environment variables, which are outside settings given to the app. `secure` becomes true only in production, meaning the real live site.

```tsx
  const supabaseOrigin = url ? new URL(url).origin : "";
  const browserSupabaseOrigin = "https://plbtnltcocsuekifddat.supabase.co";
```
These lines figure out which Supabase website address is allowed for browser connections. `origin` means the scheme plus host, like the street and house number part of an address.

```tsx
  const policy = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.paystack.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https://*.supabase.co",
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    `script-src 'self' 'nonce-${nonce}'`,
    `connect-src 'self' ${browserSupabaseOrigin}${supabaseOrigin && supabaseOrigin !== browserSupabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
    "font-src 'self' https://fonts.gstatic.com",
    "upgrade-insecure-requests",
  ].join("; ");
```
This builds a `Content-Security-Policy`, often shortened to CSP. Think of it like a school rule sheet saying which doors, pictures, scripts, and internet connections are allowed. `self` means “only from this same site.” `join("; ")` turns the list into one long header string.

```tsx
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
```
A `header` is extra label information attached to a request or response, like stickers on a parcel. This copies the request headers, adds the nonce and policy, and creates the next response object to keep the request moving.

```tsx
  if (url && key) {
    const supabase = createServerClient(url, key, {
```
This only runs if both the Supabase URL and key exist. Then it creates a server-side Supabase client.

```tsx
      cookieOptions: {
        name: "nestgh-admin-auth",
        path: "/",
        sameSite: "strict",
        secure,
        httpOnly: true,
        maxAge: 30 * 60,
      },
```
A `cookie` is a tiny note the browser stores for a site. These options make the auth cookie strict and safer: `sameSite: "strict"` helps block cross-site sending, `httpOnly` hides it from normal browser JavaScript, and `maxAge` says it lasts 30 minutes.

```tsx
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
```
This tells Supabase how to read all cookies from the request and how to write updated cookies back.

```tsx
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            response = NextResponse.next({ request: { headers: requestHeaders } });
```
For each cookie Supabase wants to set, the code updates the request copy and refreshes the response object. `for` here means “repeat this for every cookie.”

```tsx
            response.cookies.set(name, value, {
              ...options,
              path: "/",
              sameSite: "strict",
              secure,
              httpOnly: true,
              maxAge: 30 * 60,
            });
          }
        },
      },
    });
```
This writes the cookie onto the real response with the same safety rules. `...options` means “start with the existing options, then override some parts.”

```tsx
    await supabase.auth.getUser();
  }
```
`await` means “pause here until the answer comes back.” This asks Supabase for the current signed-in user so auth cookies stay in sync.

```tsx
  response.headers.set("Content-Security-Policy", policy);
  return response;
}
```
Before sending the response, it makes sure the security policy header is attached, then hands the response back.

```tsx
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```
This `config` tells Next.js where the proxy should run. A `matcher` is like a list of doors the guard watches. This pattern skips built Next.js files, the favicon, and common image files.

## `next.config.ts`
This file is like the house settings panel in a utility closet.

```tsx
import type { NextConfig } from "next";
```
This brings in the shape for a Next.js config object.

```tsx
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];
```
This is a bundle of security response headers. They are like house rules attached to every outgoing package. For example, `DENY` blocks framing, and `Strict-Transport-Security` tells browsers to prefer HTTPS for a long time.

```tsx
const staticCache = (value: string) => [{ key: "Cache-Control", value }];
```
This is a tiny helper function that makes cache headers. A `cache` is like keeping a snack box nearby so you do not have to walk to the kitchen every time. Here it helps browsers reuse files instead of asking again right away.

```tsx
const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
```
This starts the main config object. `poweredByHeader: false` removes the “powered by Next.js” response header. `compress: true` lets Next.js shrink responses, like squeezing air out of a bag to make it smaller.

```tsx
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/index.html" }], afterFiles: [], fallback: [] };
  },
```
A `rewrite` changes which file answers a request without changing the address people see. It is like sending someone to a different classroom but keeping the same hallway sign. Here `/` serves `/index.html`.

```tsx
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
```
This begins the header rules. It applies the shared security headers to every path.

```tsx
      {
        source: "/:file(.*\\.(?:webp|png|jpg|jpeg|svg))",
        headers: staticCache("public, max-age=86400, stale-while-revalidate=604800"),
      },
```
This tells browsers to cache image files for a day. `stale-while-revalidate` means “it is okay to use the old copy for a bit while quietly checking for a fresh one.”

```tsx
      {
        source: "/:file(app|commercial-listings|font-loader|supabase|supabase-config|ghana-locations).js",
        headers: staticCache("public, max-age=3600, stale-while-revalidate=86400"),
      },
```
This gives certain JavaScript files a one-hour cache, with one extra day where a stale copy may still be used while updating.

```tsx
      { source: "/styles.css", headers: staticCache("public, max-age=3600, stale-while-revalidate=86400") },
      { source: "/index.html", headers: staticCache("public, max-age=0, must-revalidate") },
    ];
  },
};
```
This does the same for the main CSS file, but `index.html` gets no lasting cache. `must-revalidate` means the browser should check again instead of trusting an old page shell.

```tsx
export default nextConfig;
```
This shares the finished config object as the main export.

## `eslint.config.mjs`
This file is like the classroom rulebook for code style.

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
```
This brings in ESLint helpers and two ready-made Next.js rule packs. ESLint is a code checker, like a teacher looking for messy handwriting and broken steps before homework is turned in.

```js
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
```
`defineConfig` wraps the ESLint settings. The `...` spread syntax means “pour all the items from this list into this new list.”

```js
  globalIgnores([".next/**", "node_modules/**", "supabase/functions/**", "NestGH-admin/**", "public/**", "brag-output-*/**", "docs/**", "load-test.js"]),
]);
```
`globalIgnores` says which folders and files ESLint should skip. That includes generated files, dependencies, docs, the admin project folder, the public build output, and `load-test.js`.

## `next-env.d.ts`
This file is like a tiny note that tells TypeScript which dictionaries to keep nearby.

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```
These triple-slash `reference` lines tell TypeScript to load type information from Next.js. A `reference` is like saying, “please keep this rulebook on the desk too.”

```ts
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";
```
These imports pull in generated type files from the `.next` build output so route and parameter types are known.

```ts
// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```
These comments warn that this file is generated for Next.js TypeScript support and should be left alone.

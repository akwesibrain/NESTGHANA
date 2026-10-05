# index.html explained like I'm 5

This file is like the floor plan and welcome signs in a house.

## Tiny word guide

- **Tag**: one HTML building block between `<` and `>`.
- **Attribute**: extra helper words inside a tag.
- **Class**: a shared nickname many elements can use.
- **ID**: a one-of-a-kind name for one element.
- **Template**: hidden HTML saved for later, like a folded letter in a drawer.
- **ARIA**: helper labels that make the page easier for screen readers to understand.

## Lines 1-18: Page setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Find rooms, hostels, shops and spaces to rent across Ghana. See rent, advance and move-in costs, then contact owners directly on NestGH.">
<meta name="theme-color" content="#f7f4ee">
<title>NestGH: Find a room in your preferred area</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="image" href="hero.webp" type="image/webp" fetchpriority="high">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&display=swap" data-font-stylesheet>
<noscript><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&display=swap" rel="stylesheet"></noscript>
<link rel="stylesheet" href="styles.css">
<link rel="icon" href="./logo-192.png" type="image/png">
<link rel="apple-touch-icon" href="./logo-192.png">
</head>
<body class="public-site">
```

This opening part tells the browser what kind of page this is, what language it speaks, what helpers it should load, and which stylesheet and icons to wear. A **tag** is one of the little angle-bracket building blocks. An **attribute** is extra helper text inside a tag, like a lunchbox label that says what is inside.

## Lines 19-42: Top navigation

```html
<nav>
  <div class="w">
    <div class="logo">
      <img class="logo-img" src="logo-80.webp" alt="" width="40" height="40" decoding="async">
      <div>NestGH<small>FIND · LIST · RENT</small></div>
    </div>
    <div class="links" id="links">
      <a href="#top">Home</a>
      <a href="#rooms">Rooms</a>
      <a href="#shops-spaces">Shops &amp; Spaces</a>
      <a href="#how">About</a>
      <a href="#listroom">List Your Property</a>
    </div>
    <div class="nr">
      <button class="ib" aria-label="Show saved rooms" aria-pressed="false" id="sv">
        <i data-ic="heart"></i>
      </button>
      <button class="btn gold links-btn" id="l1">List Your Property</button>
      <button class="ib m" aria-label="Menu" aria-expanded="false" aria-controls="links" id="mn">
        <i data-ic="menu"></i>
      </button>
    </div>
  </div>
</nav>
```

This is the top bar. The **class** names are like shared team jerseys many elements can wear, and the **id** names are like one special name tag for a single element. The links help people jump around the page, and the buttons open saved rooms, the listing action, and the menu.

## Lines 43-50: Hero welcome area

```html
<header class="hero" id="top">
  <div class="w">
    <p class="eyebrow"><i data-ic="shield"></i> Ghana's Trusted Property Marketplace</p>
    <h1>Find Your Next Place</h1>
    <p class="d">Rooms and hostels across Ghana, with clear details and direct owner contact.</p>
  </div>
</header>
<div class="w">
```

This is the big hello sign at the top of the page. It gives the main promise of the site and a short friendly sentence underneath.

## Lines 51-108: Search form

```html
  <form class="search" id="form" aria-label="Search rooms">
    <div class="f">
      <label for="region">
        <i data-ic="pin"></i>Region
      </label>
      <select id="region">
        <option value="">All regions</option>
      </select>
    </div>
    <div class="f town-field">
      <label for="town">
        <i data-ic="pin"></i>Town
      </label>
      <select id="town" aria-label="Town" disabled>
        <option value="">Select a region first</option>
      </select>
    </div>
    <div class="f">
      <label for="area">
        <i data-ic="home"></i>Area
      </label>
      <select id="area"></select>
    </div>
    <div class="f">
      <label for="ty">
        <i data-ic="home"></i>Property type
      </label>
      <select id="ty">
        <option value="">Any</option>
        <option value="single">Single room</option>
        <option value="chamber">Chamber and hall</option>
        <option value="self">Self-contained</option>
        <option value="hostel">Hostel</option>
      </select>
    </div>
    <div class="f">
      <label for="max">
        <i data-ic="tag"></i>Budget (per month)
      </label>
      <input
        id="max"
        type="number"
        inputmode="numeric"
        min="0"
        step="50"
        placeholder="Any"
      >
    </div>
    <button class="go" type="submit">
      <i data-ic="search"></i>Search
    </button>
  </form>
  <p id="location-status" class="location-status" role="alert" hidden></p>
  <p class="location-credit">
    Place names:
    <a href="https://www.geonames.org/" target="_blank" rel="noopener">GeoNames</a>,
    CC BY 4.0.
  </p>
```

This form is like a set of toy sorting boxes. It lets people choose region, town, area, property type, and budget, then press Search. The `for` and `id` pair on labels and fields work like matching socks so clicking the label points to the right box.

## Lines 109-127: Quick filters

```html
  <div class="opts">
    <b>Must have</b>
    <button type="button" class="mh" data-k="Water" aria-pressed="false">
      Water
    </button>
    <button type="button" class="mh" data-k="Security" aria-pressed="false">
      Security
    </button>
    <button type="button" class="mh" data-k="Kitchen" aria-pressed="false">
      Kitchen
    </button>
    <label class="stu">
      <input type="checkbox" id="stu"> I'm a student
    </label>
    <select id="camp" aria-label="Campus">
      <option value="">Select student to load campuses</option>
    </select>
  </div>
</div>
```

These extra filters are like easy light switches. People can tap must-have features, turn on student mode, and choose a campus.

## Lines 128-148: Trust strip

```html
<section class="trust">
  <div class="w">
    <div class="tr">
      <i data-ic="home"></i>
      <b>Verified listings</b><span>Genuine listings from verified owners</span>
    </div>
    <div class="tr">
      <i data-ic="chat"></i>
      <b>Direct contact</b>
      <span>WhatsApp or call the owner</span>
    </div>
    <div class="tr">
      <i data-ic="heart"></i>
      <b>Better Living</b><span>Find a home that fits your lifestyle</span>
    </div>
    <div class="tr">
      <i data-ic="shield"></i>
      <b>Trusted &amp; Secure</b><span>Safe transactions with complete transparency</span>
    </div>
  </div>
</section>
```

This strip quickly tells visitors why they should feel safe here. Each little block works like a badge on a school uniform saying what the website is proud of.

## Lines 149-185: Popular categories

```html
<section class="sec categories" id="categories" aria-labelledby="categories-title">
  <div class="w">
    <div class="head">
      <div>
        <p class="eyebrow">Explore properties</p>
        <h2 id="categories-title">Popular Categories</h2>
      </div>
      <a class="section-link" href="#rooms">View all <span aria-hidden="true">→</span></a>
    </div>
    <div class="category-grid">
      <a class="category-card" href="#rooms" data-category="rooms" data-room-type="" data-reveal="fade-up">
        <span class="category-icon"><i data-ic="home"></i></span>
        <span><b>Rooms</b><small>Affordable &amp; comfortable rooms</small></span>
      </a>
      <a class="category-card" href="#rooms" data-category="houses" data-reveal="fade-up">
        <span class="category-icon"><i data-ic="home"></i></span>
        <span><b>Houses</b><small>Family homes &amp; apartments</small></span>
      </a>
      <a class="category-card" href="#rooms" data-category="hostels" data-room-type="hostel" data-reveal="fade-up">
        <span class="category-icon"><i data-ic="user"></i></span>
        <span><b>Hostels</b><small>Student &amp; worker hostels</small></span>
      </a>
      <a class="category-card" href="#shops-spaces" data-category="shops" data-commercial-type="Shop" data-reveal="fade-up">
        <span class="category-icon"><i data-ic="tag"></i></span>
        <span><b>Shops</b><small>Retail &amp; business spaces</small></span>
      </a>
      <a class="category-card" href="#shops-spaces" data-category="offices" data-commercial-type="Office" data-reveal="fade-up">
        <span class="category-icon"><i data-ic="home"></i></span>
        <span><b>Offices</b><small>Workspaces &amp; offices</small></span>
      </a>
      <a class="category-card" href="#shops-spaces" data-category="warehouses" data-commercial-type="Warehouse" data-reveal="fade-up">
        <span class="category-icon"><i data-ic="home"></i></span>
        <span><b>Warehouses</b><small>Storage &amp; industrial spaces</small></span>
      </a>
    </div>
  </div>
</section>
```

This section gives big shortcut cards for popular property types. The repeated card links are grouped together because they all do the same job: send people to the right part of the page with ready-made filter hints.

## Lines 186-272: Available rooms area

```html
<section class="sec" id="rooms">
  <div class="w">
    <div class="head">
      <div>
        <p class="eyebrow" id="re">Rooms in your area</p>
        <h2 id="rt">Available rooms</h2>
      </div>
      <button id="clr">
        Clear filters <i data-ic="arrow"></i>
      </button>
    </div>
    <p id="db-status" class="sr-only" role="status" aria-live="polite">
      Loading available rooms.
    </p>
    <p id="payment-return-status" role="status" aria-live="polite" hidden></p>
    <button class="btn2" id="retry-payment" type="button" hidden>
      Retry secure payment
    </button>
    <div class="grid" id="list" aria-busy="true" aria-label="Available rooms">
      <article class="card skeleton-card" aria-hidden="true">
        <div class="skeleton-image skel"></div>
        <div class="skeleton-body">
          <span class="skel skeleton-title"></span>
          <span class="skel skeleton-location"></span>
          <span class="skel skeleton-facility"></span>
          <span class="skel skeleton-meta"></span>
          <span class="skel skeleton-price"></span>
        </div>
      </article>
      <article class="card skeleton-card" aria-hidden="true">
        <div class="skeleton-image skel"></div>
        <div class="skeleton-body">
          <span class="skel skeleton-title"></span>
          <span class="skel skeleton-location"></span>
          <span class="skel skeleton-facility"></span>
          <span class="skel skeleton-meta"></span>
          <span class="skel skeleton-price"></span>
        </div>
      </article>
      <article class="card skeleton-card" aria-hidden="true">
        <div class="skeleton-image skel"></div>
        <div class="skeleton-body">
          <span class="skel skeleton-title"></span>
          <span class="skel skeleton-location"></span>
          <span class="skel skeleton-facility"></span>
          <span class="skel skeleton-meta"></span>
          <span class="skel skeleton-price"></span>
        </div>
      </article>
      <article class="card skeleton-card" aria-hidden="true">
        <div class="skeleton-image skel"></div>
        <div class="skeleton-body">
          <span class="skel skeleton-title"></span>
          <span class="skel skeleton-location"></span>
          <span class="skel skeleton-facility"></span>
          <span class="skel skeleton-meta"></span>
          <span class="skel skeleton-price"></span>
        </div>
      </article>
      <article class="card skeleton-card" aria-hidden="true">
        <div class="skeleton-image skel"></div>
        <div class="skeleton-body">
          <span class="skel skeleton-title"></span>
          <span class="skel skeleton-location"></span>
          <span class="skel skeleton-facility"></span>
          <span class="skel skeleton-meta"></span>
          <span class="skel skeleton-price"></span>
        </div>
      </article>
      <article class="card skeleton-card" aria-hidden="true">
        <div class="skeleton-image skel"></div>
        <div class="skeleton-body">
          <span class="skel skeleton-title"></span>
          <span class="skel skeleton-location"></span>
          <span class="skel skeleton-facility"></span>
          <span class="skel skeleton-meta"></span>
          <span class="skel skeleton-price"></span>
        </div>
      </article>
    </div>
    <div class="load-more-wrap">
      <button class="btn2" id="load-more" type="button" hidden>
        Load more rooms
      </button>
    </div>
  </div>
</section>
```

This section is the waiting shelf for room results. The skeleton cards are pretend placeholder cards, like empty lunch trays, so the page does not look blank while real data is loading.

## Lines 273-347: Shops and spaces area

```html
<section class="sec shops-page" id="shops-spaces" aria-labelledby="shops-title">
  <div class="w">
    <div class="shops-breadcrumb" role="navigation" aria-label="Breadcrumb">
      <a href="#top">Home</a><span aria-hidden="true">/</span><span aria-current="page">Shops &amp; Spaces</span>
    </div>
    <div class="head shops-heading">
      <div>
        <p class="eyebrow">Commercial property</p>
        <h2 id="shops-title">Shops &amp; Spaces to Let</h2>
        <p class="shops-intro">Find a business space using details provided by property owners.</p>
      </div>
    </div>
    <form class="shops-filters" id="commercial-filters" aria-label="Filter shops and spaces">
      <div class="f">
        <label for="commercial-region"><i data-ic="pin"></i>Region</label>
        <select id="commercial-region" name="region"><option value="">All regions</option></select>
      </div>
      <div class="f">
        <label for="commercial-town"><i data-ic="pin"></i>Town</label>
        <select id="commercial-town" name="town" disabled><option value="">Select a region first</option></select>
      </div>
      <div class="f">
        <label for="commercial-type"><i data-ic="home"></i>Space type</label>
        <select id="commercial-type" name="type"><option value="">Any type</option></select>
      </div>
      <div class="f">
        <label for="commercial-min-rent"><i data-ic="tag"></i>Minimum monthly rent</label>
        <input id="commercial-min-rent" name="minRent" type="number" min="0" step="any" inputmode="decimal" placeholder="No minimum">
      </div>
      <div class="f">
        <label for="commercial-max-rent"><i data-ic="tag"></i>Maximum monthly rent</label>
        <input id="commercial-max-rent" name="maxRent" type="number" min="0" step="any" inputmode="decimal" placeholder="No maximum">
      </div>
      <div class="f">
        <label for="commercial-min-size">Minimum size</label>
        <input id="commercial-min-size" name="minSize" type="number" min="0" step="any" inputmode="decimal" placeholder="Any size">
      </div>
      <div class="f">
        <label for="commercial-max-size">Maximum size</label>
        <input id="commercial-max-size" name="maxSize" type="number" min="0" step="any" inputmode="decimal" placeholder="Any size">
      </div>
      <div class="f">
        <label for="commercial-road">Road visibility</label>
        <select id="commercial-road" name="roadVisibility"><option value="">Any</option><option value="true">Visible from road</option><option value="false">Not visible from road</option></select>
      </div>
      <div class="f">
        <label for="commercial-parking">Parking</label>
        <select id="commercial-parking" name="parking"><option value="">Any</option><option value="true">Parking available</option><option value="false">No parking</option></select>
      </div>
      <div class="f">
        <label for="commercial-electricity">Electricity</label>
        <select id="commercial-electricity" name="electricity"><option value="">Any</option><option value="true">Available</option><option value="false">Not available</option></select>
      </div>
      <div class="f">
        <label for="commercial-water">Water</label>
        <select id="commercial-water" name="water"><option value="">Any</option><option value="true">Available</option><option value="false">Not available</option></select>
      </div>
      <button class="go" type="submit"><i data-ic="search"></i>Search spaces</button>
      <button class="btn2 shops-clear" id="commercial-clear" type="button">Clear Filters</button>
    </form>
    <p class="shops-state" id="commercial-status" role="status" aria-live="polite">Browse available commercial spaces.</p>
    <div class="commercial-grid" id="commercial-list" aria-live="polite" aria-busy="false"></div>
    <button class="btn2 commercial-load-more" id="commercial-load-more" type="button" hidden>Load more spaces</button>
    <div class="empty shops-empty" id="commercial-empty" hidden>
      <span class="shops-empty-icon"><i data-ic="home"></i></span>
      <b>No shops or spaces available yet.</b>
      <p>New commercial listings will appear here when available.</p>
    </div>
    <div class="empty shops-error" id="commercial-error" hidden>
      <span class="shops-empty-icon"><i data-ic="shield"></i></span>
      <b>We couldn't load shops &amp; spaces. Please try again.</b>
      <button class="btn2" id="commercial-retry" type="button">Try again</button>
    </div>
  </div>
</section>
```

This section is the matching search area for commercial spaces. It has its own breadcrumb, filters, result grid, load-more button, empty state, and error state.

## Lines 348-366: Why NestGH section

```html
<section class="sec" id="how">
  <div class="w why">
    <figure class="why-media" data-reveal="fade-up">
      <img src="hero-480.webp" srcset="hero-480.webp 480w, hero.webp 800w" sizes="(min-width: 900px) 520px, 92vw" alt="A modern home" width="480" height="720" loading="lazy" decoding="async">
      <figcaption>Rooms you can trust</figcaption>
    </figure>
    <div class="why-copy" data-reveal="fade-up">
      <p class="why-eyebrow">Why NestGH</p>
      <h2>More than listings.<br>We Help You Find What's Actually Available</h2>
      <p>Finding a room in Ghana should be about more than seeing a photo and calling a number. NestGH helps you check where the room is, what it costs, what comes with it, and whether it is available before you make the trip.</p>
      <dl class="why-stats">
        <div><dt>12K+</dt><dd>Happy Clients</dd></div>
        <div><dt>500+</dt><dd>Properties Listed</dd></div>
        <div><dt>1000+</dt><dd>Areas Around Ghana</dd></div>
        <div><dt>98%</dt><dd>Success Rate</dd></div>
      </dl>
    </div>
  </div>
</section>
```

This part explains the bigger idea behind the site. It mixes a picture, a short story, and some big number facts to build trust.

## Lines 367-390: List your property call-to-action

```html
<div class="w" id="listroom">
  <section class="cta">
  <div class="cta-icon"><i data-ic="home"></i></div>
  <div class="cta-copy">
    <h2>List Your Property</h2>
    <p>Reach thousands of active seekers looking for rooms, homes, shops and spaces.</p>
  </div>
  <button class="btn gold" id="l2">
    Get Started <i data-ic="arrow"></i>
  </button>
  <svg class="cta-art" viewBox="0 0 220 100" aria-hidden="true">
    <circle cx="168" cy="36" r="31" fill="#ccebd8"/>
    <path d="M125 87h87" stroke="#80c69b" stroke-width="5" stroke-linecap="round"/>
    <path d="M135 48 172 18l36 30v38h-73z" fill="#fff" stroke="#13804f" stroke-width="4" stroke-linejoin="round"/>
    <path d="m128 49 44-36 43 36" fill="none" stroke="#075f3a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M164 86V59h17v27M144 55h12v12h-12zM187 55h12v12h-12z" fill="#ccebd8" stroke="#13804f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M20 77h45" stroke="#80c69b" stroke-width="4" stroke-linecap="round"/>
    <path d="M31 54h39v24H31z" fill="#e9c96f" stroke="#c39b33" stroke-width="2"/>
    <path d="M35 54V42h31v12" fill="#fff7df" stroke="#c39b33" stroke-width="2"/>
    <path d="M38 64h25" stroke="#735c25" stroke-width="2" stroke-linecap="round"/>
    <path d="M43 70h15" stroke="#735c25" stroke-width="2" stroke-linecap="round"/>
  </svg>
  </section>
</div>
```

This is the big invitation for owners to add a listing. It is like a bright shop sign saying, 'Come over here and get started.'

## Lines 391-427: Footer

```html
<footer>
  <div class="w">
  <div class="audience-grid">
    <div class="audience-item"><i data-ic="user"></i><span><b>For Students</b><small>Campus and student-friendly housing</small></span></div>
    <div class="audience-item"><i data-ic="home"></i><span><b>For Professionals</b><small>Convenient places to call home</small></span></div>
    <div class="audience-item"><i data-ic="heart"></i><span><b>For Families</b><small>Find a space that fits your needs</small></span></div>
    <div class="audience-item"><i data-ic="tag"></i><span><b>For Property Owners</b><small>Share your listing with seekers</small></span></div>
  </div>
  <div class="fg">
    <div class="logo">
      <img class="logo-img" src="logo-80.webp" alt="" width="40" height="40" decoding="async">
      <div>NestGH<small>FIND · LIST · RENT</small><span class="footer-tagline">Find Your Next Place</span></div>
    </div>
    <div>
      <h3>Quick links</h3>
      <a href="#top">Home</a>
      <a href="#rooms">Rooms</a>
      <a href="#how">How it works</a>
      <a href="#listroom">List Your Property</a>
    </div>
    <div>
      <h3>Policies &amp; support</h3>
      <a href="#" data-pol="privacy">Privacy Policy</a>
      <a href="#" data-pol="cookie">Cookie Policy</a>
      <a href="#" data-pol="terms">Terms and Conditions</a>
      <a href="mailto:amponsahbrain2007@gmail.com">Contact NestGH</a>
    </div>
  </div>
  <div class="fb">
    <span>&copy; 2026 NestGH. All rights reserved.</span>
    <span>
      <a href="#" id="cookie-settings">Cookie settings</a>
      <span class="ghana-badge"><span aria-hidden="true">🇬🇭</span> Proudly Ghanaian</span>
    </span>
  </div>
  </div>
</footer>
```

The footer is the tidy bottom drawer of the page. It repeats important links, policy links, and a short brand reminder so visitors can still find key things at the end.

## Lines 428-437: Mobile quick tabs

```html
<nav class="mobile-tabs" id="mobile-tabs" aria-label="Quick navigation">
  <a href="#top"><i data-ic="home"></i><span>Home</span></a>
  <a href="#rooms"><i data-ic="search"></i><span>Search</span></a>
  <button id="mobile-saved" type="button" aria-label="Show saved rooms" aria-pressed="false">
    <i data-ic="heart"></i><span>Saved</span>
  </button>
  <button id="mobile-more" type="button" aria-label="More menu" aria-expanded="false">
    <i data-ic="menu"></i><span>More</span>
  </button>
</nav>
```

These tabs are tiny shortcut buttons for phones. They keep the most important actions within easy thumb reach.

## Lines 438-458: Cookie banner

```html
<aside class="cookie-banner" id="cookie-banner" aria-label="Cookie consent" hidden>
  <div class="cookie-copy">
    <div class="cookie-icon" aria-hidden="true">i</div>
    <div>
      <h2>We value your privacy</h2>
      <p>
        NestGH uses essential browser storage to keep the site working and remember your preferences.
        Optional cookies are only used with your consent.
        <a href="#" data-pol="cookie">Cookie Policy</a>
      </p>
    </div>
  </div>
  <div class="cookie-actions">
    <button class="cookie-reject" id="cookie-reject" type="button">
      Reject
    </button>
    <button class="cookie-accept" id="cookie-accept" type="button">
      Accept Cookies
    </button>
  </div>
</aside>
```

This hidden banner is the website's polite cookie note. `hidden` means it starts tucked away until JavaScript decides it should appear.

## Lines 459-460: Overlay sheets

```html
<div class="sheet" id="sheet"></div>
<div class="sheet" id="psheet"></div>
```

These two empty sheet layers are like clear plastic covers placed over the page when a popup opens.

## Lines 461-479: Listing form dialog

```html
<div class="lf" id="lf" role="dialog" aria-modal="true" aria-label="List a property">
  <div class="lh">
    <div class="lw">
      <div class="lt">
        <b>List a property</b>
        <button class="ib" id="lx" aria-label="Close form">✕</button>
      </div>
      <div id="pb"></div>
      <div class="pn" id="pn"></div>
    </div>
  </div>
  <div class="lw lbody" id="lb"></div>
  <div class="lfoot">
    <div class="lw">
      <button class="btn2 big" id="bk">Back</button>
      <button class="btn gold big" id="nx">Next</button>
    </div>
  </div>
</div>
```

This is the shell for the multi-step property listing popup. `role="dialog"` and `aria-modal="true"` are helper notes for screen readers so they know this acts like a focused popup window.

## Lines 480-491: Policy dialog and back-to-top button

```html
<div class="pol" id="pol" role="dialog" aria-modal="true" aria-label="Policy">
  <div class="ph">
    <div class="lw">
      <b id="pt2"></b>
      <button class="ib" id="px" aria-label="Close">✕</button>
    </div>
  </div>
  <article class="pc" id="pc"></article>
</div>
<button id="back-to-top" class="back-to-top" type="button" aria-label="Back to top" hidden>
  <i data-ic="arrow"></i>
</button>
```

This popup holds policy text when someone opens Privacy, Cookie, or Terms. The back-to-top button is another hidden helper that can appear later to zip people back to the top.

## Lines 492-497: Privacy Policy template start

```html
<template id="t-privacy">
<h1>NestGH Privacy Policy</h1>
<p>
  <strong>Effective date:</strong> 30 September 2026<br>
  <strong>Last updated:</strong> 30 September 2026
</p>
```

This starts the hidden Privacy Policy text. A **template** is like a packed lunch box the page keeps closed until it needs to show it later. This first part gives the title, dates, and opening hello for the policy.

## Lines 498-522: 1. Introduction

```html
<h2>1. Introduction</h2>
<p>
  Welcome to <strong>NestGH</strong> ("NestGH", "we", "us" or "our").
</p>
<p>
  NestGH is a Ghanaian platform that helps people find available rooms,
  student hostels and other accommodation.
</p>
<p>
  This Privacy Policy explains how we collect, use, store, protect and share
  personal information when you search for accommodation, contact an owner,
  submit a listing, or otherwise use our website and services.
</p>
<p>
  <strong>Operated by:</strong> Brain Amponsah, trading as NestGH<br>
  <strong>Location:</strong> Accra, Ghana<br>
  <strong>Email:</strong>
  <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a><br>
  <strong>Phone:</strong>
  <a href="tel:0540309637">0540309637</a>
</p>
<p>
  By using NestGH you acknowledge this Privacy Policy. Where the law requires
  your consent, for example when you submit a listing, we ask for it separately.
</p>
```

This part writes the Privacy Policy section called **1. Introduction**. In simple words, it talks about 1. introduction welcome to nestgh ("nestgh", "we", "us" or "our"). nestgh is a ghanaian platform that helps people find available rooms, student hostels and other accommodation. this privacy policy explains how we.... It also includes contact details.

## Lines 523-523: 2. Information we collect

```html
<h2>2. Information we collect</h2>
```

This part writes the Privacy Policy section called **2. Information we collect**. In simple words, it talks about 2. information we collect.

## Lines 524-534: 2.1 People searching for accommodation

```html
<h3>2.1 People searching for accommodation</h3>
<p>
  You can search NestGH without creating an account. When you search, we may collect:
</p>
<ul>
  <li>Your search choices: town, area, budget, accommodation type and must-have facilities</li>
  <li>If you use student mode, the campus you choose</li>
  <li>Listings you save, which are stored in your browser on your own device</li>
  <li>A count of when you tap WhatsApp or Call on a listing. We record that a tap happened so owners can see interest. We do not see or record the content of your calls or WhatsApp messages.</li>
  <li>Any report you submit about a listing, and any message you send us</li>
</ul>
```

This part writes the Privacy Policy section called **2.1 People searching for accommodation**. In simple words, it talks about 2.1 people searching for accommodation you can search nestgh without creating an account. when you search, we may collect: your search choices: town, area, budget, accommodation type and must-have facilities if you use.... It also includes a bullet list of simple points.

## Lines 535-551: 2.2 Property owners, caretakers and hostel managers

```html
<h3>2.2 Property owners, caretakers and hostel managers</h3>
<p>
  When you submit a listing, we collect:
</p>
<ul>
  <li>Your full name, profile photograph, phone number and WhatsApp number</li>
  <li>Your email address, if you give it</li>
  <li>Your role (Property Owner, Caretaker, Hostel Manager or Authorized Representative) and your relationship to the property</li>
  <li>Property details: title, description, accommodation type, condition, size, floor, furnishing and features</li>
  <li>Location details: region, town, area, nearest landmark, map location, and the exact address or directions</li>
  <li>Price details: rent, payment period, advance, deposit, agency or caretaker fee and other charges</li>
  <li>What is included, what is not included, facilities, house rules and who may stay</li>
  <li>Availability details, and the date you submit or confirm them</li>
  <li>Property photographs</li>
  <li>Payment references and transaction status (see section 5)</li>
  <li>Any information you give us during verification, and your communications with us</li>
</ul>
```

This part writes the Privacy Policy section called **2.2 Property owners, caretakers and hostel managers**. In simple words, it talks about 2.2 property owners, caretakers and hostel managers when you submit a listing, we collect: your full name, profile photograph, phone number and whatsapp number your email address, if you give it your role (property.... It also includes a bullet list of simple points.

## Lines 552-558: 2.3 Information collected automatically

```html
<h3>2.3 Information collected automatically</h3>
<p>
  When you use NestGH, we and our service providers may automatically receive
  technical information such as your IP address, browser type, device type,
  operating system, the pages you visit, the date and time of access, and error
  information. We use it for security, troubleshooting, and improving the website.
</p>
```

This part writes the Privacy Policy section called **2.3 Information collected automatically**. In simple words, it talks about 2.3 information collected automatically when you use nestgh, we and our service providers may automatically receive technical information such as your ip address, browser type, device type, operating system, the pages....

## Lines 559-576: 3. What the public can see

```html
<h2>3. What the public can see</h2>
<p>
  After a listing has been reviewed and approved, it may be seen by anyone who visits NestGH.
  Public information may include the listing title, type, description, photos, area,
  nearest landmark, price and costs, what is included and not included, facilities,
  rules, availability and when it was last confirmed, your name, profile photograph
  and role, and WhatsApp and Call buttons linked to your phone numbers.
</p>
<p>
  <strong>What stays private:</strong> your exact address and directions, the exact map pin,
  your email address, payment details and any identity documents. Exact address details
  are seen only by NestGH administrators. We do not publish identity documents or other
  confidential verification information.
</p>
<p>
  Photos are resized in your browser before upload, and hidden metadata such as GPS
  location tags is removed.
</p>
```

This part writes the Privacy Policy section called **3. What the public can see**. In simple words, it talks about 3. what the public can see after a listing has been reviewed and approved, it may be seen by anyone who visits nestgh. public information may include the listing title, type, description, photos, area, nearest landmark,....

## Lines 577-590: 4. Owner profile photos and verification

```html
<h2>4. Owner profile photos and verification</h2>
<p>
  We require owners, caretakers, hostel managers and authorised representatives to
  upload a profile photograph so that people know who they are contacting.
</p>
<p>
  A profile photograph, or a paid listing, <strong>does not mean</strong> that NestGH
  has verified the person, the property or the listing.
</p>
<p>
  NestGH may separately show <strong>Phone Verified</strong>,
  <strong>Identity Verified</strong> and <strong>Property Verified</strong>.
  A status is shown only after NestGH has actually completed that check.
</p>
```

This part writes the Privacy Policy section called **4. Owner profile photos and verification**. In simple words, it talks about 4. owner profile photos and verification we require owners, caretakers, hostel managers and authorised representatives to upload a profile photograph so that people know who they are contacting. a profile photograph, or....

## Lines 591-603: 5. Payment information

```html
<h2>5. Payment information</h2>
<p>
  Owners pay a <strong>one-time Standard listing fee</strong>. There is no monthly
  subscription and no renewal fee for keeping a listing live while the room is
  genuinely available.
</p>
<p>
  Payments are processed by a third-party provider, <strong>Paystack</strong>,
  using Mobile Money or card. We receive information such as the payment reference,
  status, amount, date and time, payment method and transaction identifiers.
  We do not store complete card numbers, card security codes or Mobile Money PINs.
  Paystack's own privacy policy and terms apply to the information it processes.
</p>
```

This part writes the Privacy Policy section called **5. Payment information**. In simple words, it talks about 5. payment information owners pay a one-time standard listing fee. there is no monthly subscription and no renewal fee for keeping a listing live while the room is genuinely available. payments are processed by a....

## Lines 604-618: 6. How we use personal information

```html
<h2>6. How we use personal information</h2>
<p>We use personal information to:</p>
<ul>
  <li>Run the marketplace, and let people search and contact owners</li>
  <li>Save your listing as a draft so you can retry a failed payment without losing your information</li>
  <li>Process listing payments and confirm payment status</li>
  <li>Review, approve, edit, reject or remove listings</li>
  <li>Confirm that accommodation is still available and show when it was last confirmed</li>
  <li>Contact owners about their listings</li>
  <li>Detect and prevent fraud, scams and misleading listings, and investigate reports</li>
  <li>Answer enquiries and provide support</li>
  <li>Improve the website and search</li>
  <li>Keep the website secure and prevent abuse</li>
  <li>Comply with legal requirements</li>
</ul>
```

This part writes the Privacy Policy section called **6. How we use personal information**. In simple words, it talks about 6. how we use personal information we use personal information to: run the marketplace, and let people search and contact owners save your listing as a draft so you can retry a failed payment without losing your.... It also includes a bullet list of simple points.

## Lines 619-627: 7. Consent and legal basis

```html
<h2>7. Consent and legal basis</h2>
<p>
  We process personal information where you have given consent, where it is necessary
  to provide the service you asked for, where it is necessary to comply with the law,
  and where we have a legitimate interest in keeping NestGH safe and working.
  When you submit a listing, you separately consent to your profile photograph and
  contact information being shown to people who view your listing. You can withdraw
  consent by contacting us, but we may then have to remove the listing.
</p>
```

This part writes the Privacy Policy section called **7. Consent and legal basis**. In simple words, it talks about 7. consent and legal basis we process personal information where you have given consent, where it is necessary to provide the service you asked for, where it is necessary to comply with the law, and where we have a....

## Lines 628-634: 8. Listing review and approval

```html
<h2>8. Listing review and approval</h2>
<p>
  After payment, a listing enters review. Payment does not approve it. NestGH may
  approve a listing, ask for changes, reject it, edit it, hide it, mark it unavailable,
  or remove it, and may contact you to confirm information. Only approved listings
  are made public.
</p>
```

This part writes the Privacy Policy section called **8. Listing review and approval**. In simple words, it talks about 8. listing review and approval after payment, a listing enters review. payment does not approve it. nestgh may approve a listing, ask for changes, reject it, edit it, hide it, mark it unavailable, or remove it, and may....

## Lines 635-642: 9. Availability information

```html
<h2>9. Availability information</h2>
<p>
  We try to show current availability. We may contact owners to confirm that
  accommodation is still available, and this confirmation does not cost the owner
  anything. The date of the latest confirmation may be shown on the listing.
  A confirmation shows how fresh the information is. It does not guarantee that
  a room will still be free when you contact the owner.
</p>
```

This part writes the Privacy Policy section called **9. Availability information**. In simple words, it talks about 9. availability information we try to show current availability. we may contact owners to confirm that accommodation is still available, and this confirmation does not cost the owner anything. the date of the latest....

## Lines 643-649: 10. Reports and safety

```html
<h2>10. Reports and safety</h2>
<p>
  People can report a listing because the room is taken, the price or location is wrong,
  the photos are misleading, the owner is not responding, or the listing looks suspicious
  or like a scam. We may investigate and take action, including editing, hiding or removing
  the listing, and we may contact the owner about the report.
</p>
```

This part writes the Privacy Policy section called **10. Reports and safety**. In simple words, it talks about 10. reports and safety people can report a listing because the room is taken, the price or location is wrong, the photos are misleading, the owner is not responding, or the listing looks suspicious or like a scam. we....

## Lines 650-654: 11. Cookies and similar technologies

```html
<h2>11. Cookies and similar technologies</h2>
<p>
  We use cookies and similar technologies such as browser storage. Please read our
  <a href="#" data-pol="cookie">Cookie Policy</a> for what we use and how to control it.
</p>
```

This part writes the Privacy Policy section called **11. Cookies and similar technologies**. In simple words, it talks about 11. cookies and similar technologies we use cookies and similar technologies such as browser storage. please read our cookie policy for what we use and how to control it..

## Lines 655-667: 12. How we share information

```html
<h2>12. How we share information</h2>
<p>We share information where reasonably necessary with:</p>
<ul>
  <li>Payment providers (Paystack)</li>
  <li>Hosting, database and storage providers</li>
  <li>Security and analytics providers, if we use them</li>
  <li>Communication providers</li>
  <li>Professional advisers</li>
  <li>Government authorities or law enforcement, where the law requires it</li>
</ul>
<p>
  We do not sell personal information.
</p>
```

This part writes the Privacy Policy section called **12. How we share information**. In simple words, it talks about 12. how we share information we share information where reasonably necessary with: payment providers (paystack) hosting, database and storage providers security and analytics providers, if we use them communication.... It also includes a bullet list of simple points.

## Lines 668-678: 13. Public information and your responsibilities

```html
<h2>13. Public information and your responsibilities</h2>
<p>
  Anything in a public listing can be seen, copied or saved by anyone, and we cannot
  control what others do with it after they see it.
</p>
<p>
  Do not put any of the following in your listing, including the description and rules fields:
  passwords, bank or Mobile Money details, national ID numbers, other people's personal
  information (such as the names or phone numbers of tenants) without their permission,
  or sensitive personal information.
</p>
```

This part writes the Privacy Policy section called **13. Public information and your responsibilities**. In simple words, it talks about 13. public information and your responsibilities anything in a public listing can be seen, copied or saved by anyone, and we cannot control what others do with it after they see it. do not put any of the following in....

## Lines 679-685: 14. WhatsApp, phone and other third-party services

```html
<h2>14. WhatsApp, phone and other third-party services</h2>
<p>
  When you tap WhatsApp or Call, your conversation happens through WhatsApp or your
  phone network, which process information under their own policies. When you open
  a map link, Google Maps processes your visit under Google's policies. We do not
  control how these services handle information once you leave NestGH.
</p>
```

This part writes the Privacy Policy section called **14. WhatsApp, phone and other third-party services**. In simple words, it talks about 14. whatsapp, phone and other third-party services when you tap whatsapp or call, your conversation happens through whatsapp or your phone network, which process information under their own policies. when you open a map....

## Lines 686-691: 15. Data security

```html
<h2>15. Data security</h2>
<p>
  We take reasonable steps to protect personal information against unauthorised access,
  disclosure, loss, misuse, alteration and destruction. No internet service can guarantee
  absolute security. Please protect your own devices and accounts.
</p>
```

This part writes the Privacy Policy section called **15. Data security**. In simple words, it talks about 15. data security we take reasonable steps to protect personal information against unauthorised access, disclosure, loss, misuse, alteration and destruction. no internet service can guarantee absolute security. please....

## Lines 692-698: 16. Accuracy

```html
<h2>16. Accuracy</h2>
<p>
  Owners must give accurate and current information. Owners are responsible for making
  sure that their listing details and prices are accurate, availability is current,
  photos show the real accommodation, and they are authorised to advertise the property.
  We may update, hide or remove information that appears inaccurate or misleading.
</p>
```

This part writes the Privacy Policy section called **16. Accuracy**. In simple words, it talks about 16. accuracy owners must give accurate and current information. owners are responsible for making sure that their listing details and prices are accurate, availability is current, photos show the real accommodation, and....

## Lines 699-734: 17. How long we keep information

```html
<h2>17. How long we keep information</h2>
<p>
  We keep personal information only as long as reasonably necessary. As a general guide:
</p>
<div class="tw">
  <table>
    <tr>
      <th>Information</th>
      <th>How long we keep it</th>
    </tr>
    <tr>
      <td>Live listing and owner details</td>
      <td>While the listing is live, and up to 12 months after it is removed, then deleted or anonymised</td>
    </tr>
    <tr>
      <td>Unpaid or abandoned drafts</td>
      <td>Deleted 30 days after the last activity</td>
    </tr>
    <tr>
      <td>Payment records</td>
      <td>For the period required by Ghanaian tax and accounting rules</td>
    </tr>
    <tr>
      <td>Reports, fraud and dispute records</td>
      <td>Up to 24 months, or longer if needed for a legal matter</td>
    </tr>
    <tr>
      <td>Server and security logs</td>
      <td>Up to 90 days</td>
    </tr>
  </table>
</div>
<p>
  We may keep information for longer where the law requires, or to handle a dispute
  or enforce our agreements.
</p>
```

This part writes the Privacy Policy section called **17. How long we keep information**. In simple words, it talks about 17. how long we keep information we keep personal information only as long as reasonably necessary. as a general guide: information how long we keep it live listing and owner details while the listing is live, and up to.... It also includes a table, which is like a neat school chart.

## Lines 735-750: 18. Your privacy rights

```html
<h2>18. Your privacy rights</h2>
<p>Subject to applicable law, you may:</p>
<ul>
  <li>Ask for access to the personal information we hold about you</li>
  <li>Ask us to correct inaccurate information</li>
  <li>Ask us to delete your information</li>
  <li>Object to, or ask us to restrict, certain processing</li>
  <li>Withdraw your consent</li>
  <li>Ask questions about how we use your information</li>
  <li>Make a complaint to us, or to the <strong>Data Protection Commission of Ghana</strong></li>
</ul>
<p>
  To use these rights, contact us using the details in section 23. If your request is
  about a listing, include the listing reference number. We may need to verify your
  identity first. We aim to respond within 30 days.
</p>
```

This part writes the Privacy Policy section called **18. Your privacy rights**. In simple words, it talks about 18. your privacy rights subject to applicable law, you may: ask for access to the personal information we hold about you ask us to correct inaccurate information ask us to delete your information object to, or ask us to.... It also includes a bullet list of simple points.

## Lines 751-758: 19. Children

```html
<h2>19. Children</h2>
<p>
  NestGH is for people aged 18 and over. Only adults may submit listings.
  We do not knowingly collect personal information from children. If you are under 18,
  please ask a parent or guardian before using NestGH. If we learn that we have collected
  a child's personal information without proper permission, we will take reasonable
  steps to delete it.
</p>
```

This part writes the Privacy Policy section called **19. Children**. In simple words, it talks about 19. children nestgh is for people aged 18 and over. only adults may submit listings. we do not knowingly collect personal information from children. if you are under 18, please ask a parent or guardian before using....

## Lines 759-764: 20. International transfers

```html
<h2>20. International transfers</h2>
<p>
  Some of our service providers may store or process information outside Ghana.
  Where we transfer personal information to another country, we take reasonable steps
  to make sure it is handled in line with applicable data protection requirements.
</p>
```

This part writes the Privacy Policy section called **20. International transfers**. In simple words, it talks about 20. international transfers some of our service providers may store or process information outside ghana. where we transfer personal information to another country, we take reasonable steps to make sure it is handled in....

## Lines 765-770: 21. Data protection compliance

```html
<h2>21. Data protection compliance</h2>
<p>
  NestGH intends to comply with the <strong>Data Protection Act, 2012 (Act 843)</strong>
  and the requirements of the <strong>Data Protection Commission of Ghana</strong>,
  including any registration that applies to us as a data controller.
</p>
```

This part writes the Privacy Policy section called **21. Data protection compliance**. In simple words, it talks about 21. data protection compliance nestgh intends to comply with the data protection act, 2012 (act 843) and the requirements of the data protection commission of ghana, including any registration that applies to us as a....

## Lines 771-776: 22. Changes to this policy

```html
<h2>22. Changes to this policy</h2>
<p>
  We may update this Privacy Policy when our services, technology or legal requirements change.
  We will update the <strong>Last updated</strong> date. If we make a significant change,
  we will tell you on the website.
</p>
```

This part writes the Privacy Policy section called **22. Changes to this policy**. In simple words, it talks about 22. changes to this policy we may update this privacy policy when our services, technology or legal requirements change. we will update the last updated date. if we make a significant change, we will tell you on the....

## Lines 777-787: 23. Contact us

```html
<h2>23. Contact us</h2>
<p>
  <strong>Operated by:</strong> Brain Amponsah, trading as NestGH<br>
  <strong>Location:</strong> Accra, Ghana<br>
  <strong>Email:</strong>
  <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a><br>
  <strong>Phone:</strong>
  <a href="tel:0540309637">0540309637</a>
</p>
<p>&copy 2026 NestGH. All rights reserved.</p>
</template>
```

This part writes the Privacy Policy section called **23. Contact us**. In simple words, it talks about 23. contact us operated by: brain amponsah, trading as nestgh location: accra, ghana email: amponsahbrain2007@gmail.com phone: 0540309637 © 2026 nestgh. all rights reserved.. It also includes contact details.

## Lines 788-793: Cookie Policy template start

```html
<template id="t-cookie">
<h1>NestGH Cookie Policy</h1>
<p>
  <strong>Effective date:</strong> 30 September 2026<br>
  <strong>Last updated:</strong> 30 September 2026
</p>
```

This starts the hidden Cookie Policy text. A **template** is like a packed lunch box the page keeps closed until it needs to show it later. This first part gives the title, dates, and opening hello for the policy.

## Lines 794-808: 1. Introduction

```html
<h2>1. Introduction</h2>
<p>
  This Cookie Policy explains how <strong>NestGH</strong> ("NestGH", "we", "us" or "our")
  uses cookies and similar technologies when you visit our website. Please read it together
  with our <a href="#" data-pol="privacy">Privacy Policy</a> and our
  <a href="#" data-pol="terms">Terms and Conditions</a>.
</p>
<p>
  <strong>Operated by:</strong> Brain Amponsah, trading as NestGH<br>
  <strong>Location:</strong> Accra, Ghana<br>
  <strong>Email:</strong>
  <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a><br>
  <strong>Phone:</strong>
  <a href="tel:0540309637">0540309637</a>
</p>
```

This part writes the Cookie Policy section called **1. Introduction**. In simple words, it talks about 1. introduction this cookie policy explains how nestgh ("nestgh", "we", "us" or "our") uses cookies and similar technologies when you visit our website. please read it together with our privacy policy and our terms and.... It also includes contact details.

## Lines 809-817: 2. What are cookies?

```html
<h2>2. What are cookies?</h2>
<p>
  Cookies are small text files that a website stores on your device. They help a website
  work, remember your choices, stay secure and understand how it is used.
</p>
<p>
  We also use <strong>similar technologies</strong>, such as your browser's local storage,
  which keeps small pieces of information on your device in a similar way.
</p>
```

This part writes the Cookie Policy section called **2. What are cookies?**. In simple words, it talks about 2. what are cookies? cookies are small text files that a website stores on your device. they help a website work, remember your choices, stay secure and understand how it is used. we also use similar technologies, such....

## Lines 818-865: 3. What we use

```html
<h2>3. What we use</h2>
<p>
  This is what NestGH uses at the time of writing:
</p>
<div class="tw">
  <table>
    <tr>
      <th>Purpose</th>
      <th>What it does</th>
      <th>Who sets it</th>
      <th>How long</th>
    </tr>
    <tr>
      <td>Essential: admin sign-in</td>
      <td>Keeps NestGH administrators signed in. Visitors and people submitting listings do not get sign-in cookies.</td>
      <td>NestGH and our database provider</td>
      <td>For the session</td>
    </tr>
    <tr>
      <td>Essential: payment</td>
      <td>Lets Paystack process listing payments securely and prevent fraud.</td>
      <td>Paystack</td>
      <td>As set by Paystack</td>
    </tr>
    <tr>
      <td>Preferences: saved rooms and search choices</td>
      <td>Remembers the rooms you save and your recent choices in your browser. This stays on your device and is not sent to us.</td>
      <td>NestGH (browser storage)</td>
      <td>Until you clear your browser data</td>
    </tr>
    <tr>
      <td>Fonts</td>
      <td>Loads the website's fonts. The provider may receive your IP address.</td>
      <td>Google Fonts</td>
      <td>As set by Google</td>
    </tr>
    <tr>
      <td>Analytics</td>
      <td>We do not currently use analytics cookies.</td>
      <td>None</td>
      <td>Not applicable</td>
    </tr>
  </table>
</div>
<p>
  If we add analytics or other non-essential cookies, we will update this policy first
  and ask for your consent where it is required.
</p>
```

This part writes the Cookie Policy section called **3. What we use**. In simple words, it talks about 3. what we use this is what nestgh uses at the time of writing: purpose what it does who sets it how long essential: admin sign-in keeps nestgh administrators signed in. visitors and people submitting listings do not.... It also includes a table, which is like a neat school chart.

## Lines 866-874: 4. Third-party cookies

```html
<h2>4. Third-party cookies</h2>
<p>
  Some services we use may set their own cookies or use similar technologies, including
  our payment provider (Paystack) and our font provider. We do not control them.
  Their own privacy and cookie policies apply.
</p>
<p>
  When you open a map link, you leave NestGH and Google Maps applies its own policies.
</p>
```

This part writes the Cookie Policy section called **4. Third-party cookies**. In simple words, it talks about 4. third-party cookies some services we use may set their own cookies or use similar technologies, including our payment provider (paystack) and our font provider. we do not control them. their own privacy and cookie....

## Lines 875-880: 5. Cookies and the information you give us

```html
<h2>5. Cookies and the information you give us</h2>
<p>
  Cookies do not replace the personal information that you choose to give us, for example
  when you submit a listing. We handle that information under our
  <a href="#" data-pol="privacy">Privacy Policy</a>.
</p>
```

This part writes the Cookie Policy section called **5. Cookies and the information you give us**. In simple words, it talks about 5. cookies and the information you give us cookies do not replace the personal information that you choose to give us, for example when you submit a listing. we handle that information under our privacy policy..

## Lines 881-886: 6. How long cookies last

```html
<h2>6. How long cookies last</h2>
<p>
  <strong>Session cookies</strong> are temporary and usually disappear when you close your browser.
  <strong>Persistent cookies</strong> stay on your device for a set period, or until you delete them.
  How long a cookie lasts depends on its purpose and on who set it.
</p>
```

This part writes the Cookie Policy section called **6. How long cookies last**. In simple words, it talks about 6. how long cookies last session cookies are temporary and usually disappear when you close your browser. persistent cookies stay on your device for a set period, or until you delete them. how long a cookie lasts....

## Lines 887-897: 7. Managing cookies

```html
<h2>7. Managing cookies</h2>
<p>
  You can manage cookies in your browser settings. Depending on your browser, you can view,
  delete or block cookies, block third-party cookies, allow them only for chosen websites,
  or delete them when you close the browser. You can also clear local storage by clearing
  your site data.
</p>
<p>
  Blocking essential cookies may stop parts of NestGH, such as payment, from working properly.
  If you clear your browser data, your saved rooms will be removed.
</p>
```

This part writes the Cookie Policy section called **7. Managing cookies**. In simple words, it talks about 7. managing cookies you can manage cookies in your browser settings. depending on your browser, you can view, delete or block cookies, block third-party cookies, allow them only for chosen websites, or delete them when....

## Lines 898-903: 8. Cookie consent

```html
<h2>8. Cookie consent</h2>
<p>
  Essential cookies do not need your consent because the website cannot work without them.
  If we use non-essential cookies, we will show a cookie banner and will not load them until
  you accept. You will be able to reject them or change your choice at any time.
</p>
```

This part writes the Cookie Policy section called **8. Cookie consent**. In simple words, it talks about 8. cookie consent essential cookies do not need your consent because the website cannot work without them. if we use non-essential cookies, we will show a cookie banner and will not load them until you accept. you will....

## Lines 904-908: 9. Do Not Track

```html
<h2>9. Do Not Track</h2>
<p>
  Some browsers have a "Do Not Track" setting. There is no universal standard for how websites
  should respond to it. We manage non-essential cookies through the choices on our website.
</p>
```

This part writes the Cookie Policy section called **9. Do Not Track**. In simple words, it talks about 9. do not track some browsers have a "do not track" setting. there is no universal standard for how websites should respond to it. we manage non-essential cookies through the choices on our website..

## Lines 909-913: 10. Children

```html
<h2>10. Children</h2>
<p>
  NestGH is for people aged 18 and over. We do not knowingly use cookies to collect personal
  information from children.
</p>
```

This part writes the Cookie Policy section called **10. Children**. In simple words, it talks about 10. children nestgh is for people aged 18 and over. we do not knowingly use cookies to collect personal information from children..

## Lines 914-919: 11. Changes to this policy

```html
<h2>11. Changes to this policy</h2>
<p>
  We may update this Cookie Policy when our technology, services, third-party providers or legal
  requirements change. We will update the <strong>Last updated</strong> date and, if the change
  is significant, tell you on the website.
</p>
```

This part writes the Cookie Policy section called **11. Changes to this policy**. In simple words, it talks about 11. changes to this policy we may update this cookie policy when our technology, services, third-party providers or legal requirements change. we will update the last updated date and, if the change is significant, tell....

## Lines 920-925: 12. Data protection

```html
<h2>12. Data protection</h2>
<p>
  NestGH intends to comply with the <strong>Data Protection Act, 2012 (Act 843)</strong>.
  For how we handle your personal information, please read our
  <a href="#" data-pol="privacy">Privacy Policy</a>.
</p>
```

This part writes the Cookie Policy section called **12. Data protection**. In simple words, it talks about 12. data protection nestgh intends to comply with the data protection act, 2012 (act 843). for how we handle your personal information, please read our privacy policy..

## Lines 926-936: 13. Contact us

```html
<h2>13. Contact us</h2>
<p>
  <strong>Operated by:</strong> Brain Amponsah, trading as NestGH<br>
  <strong>Location:</strong> Accra, Ghana<br>
  <strong>Email:</strong>
  <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a><br>
  <strong>Phone:</strong>
  <a href="tel:0540309637">0540309637</a>
</p>
<p>&copy 2026 NestGH. All rights reserved.</p>
</template>
```

This part writes the Cookie Policy section called **13. Contact us**. In simple words, it talks about 13. contact us operated by: brain amponsah, trading as nestgh location: accra, ghana email: amponsahbrain2007@gmail.com phone: 0540309637 © 2026 nestgh. all rights reserved.. It also includes contact details.

## Lines 937-942: Terms and Conditions template start

```html
<template id="t-terms">
<h1>NestGH Terms and Conditions</h1>
<p>
  <strong>Effective date:</strong> 1 October 2026<br>
  <strong>Last updated:</strong> 1 October 2026
</p>
```

This starts the hidden Terms and Conditions text. A **template** is like a packed lunch box the page keeps closed until it needs to show it later. This first part gives the title, dates, and opening hello for the policy.

## Lines 943-961: 1. Introduction and acceptance

```html
<h2>1. Introduction and acceptance</h2>
<p>
  Welcome to <strong>NestGH</strong> ("NestGH", "we", "us" or "our"). These Terms and
  Conditions ("Terms") apply when you use the NestGH website and services, whether you
  are searching for accommodation, contacting an owner, or submitting a listing.
</p>
<p>
  By using NestGH you agree to these Terms. If you do not agree, please do not use NestGH.
  Please also read our <a href="#" data-pol="privacy">Privacy Policy</a> and
  <a href="#" data-pol="cookie">Cookie Policy</a>, which explain how we handle your information.
</p>
<p>
  <strong>Operated by:</strong> Brain Amponsah, trading as NestGH<br>
  <strong>Location:</strong> Accra, Ghana<br>
  <strong>Email:</strong>
  <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a><br>
  <strong>Phone:</strong>
  <a href="tel:0540309637">0540309637</a>
</p>
```

This part writes the Terms and Conditions section called **1. Introduction and acceptance**. In simple words, it talks about 1. introduction and acceptance welcome to nestgh ("nestgh", "we", "us" or "our"). these terms and conditions ("terms") apply when you use the nestgh website and services, whether you are searching for accommodation,.... It also includes contact details.

## Lines 962-974: 2. What NestGH is, and what it is not

```html
<h2>2. What NestGH is, and what it is not</h2>
<p>
  NestGH is an online platform that helps people find available rooms, student hostels
  and other accommodation in Ghana. Owners, caretakers and hostel managers use NestGH
  to advertise their accommodation.
</p>
<p>
  NestGH is <strong>not</strong> a landlord, estate agent, property manager or hostel operator.
  We do not own, manage, inspect or rent out any accommodation listed on NestGH, and we are
  not a party to any agreement between a seeker and an owner. We do not collect or hold rent,
  deposits or any other payment between seekers and owners. Any arrangement is made directly
  between them.
</p>
```

This part writes the Terms and Conditions section called **2. What NestGH is, and what it is not**. In simple words, it talks about 2. what nestgh is, and what it is not nestgh is an online platform that helps people find available rooms, student hostels and other accommodation in ghana. owners, caretakers and hostel managers use nestgh to advertise....

## Lines 975-980: 3. Who can use NestGH

```html
<h2>3. Who can use NestGH</h2>
<p>
  You must be at least 18 years old to submit a listing. Anyone may search NestGH,
  and you do not need an account to search. If you are under 18, please ask a parent
  or guardian before using NestGH.
</p>
```

This part writes the Terms and Conditions section called **3. Who can use NestGH**. In simple words, it talks about 3. who can use nestgh you must be at least 18 years old to submit a listing. anyone may search nestgh, and you do not need an account to search. if you are under 18, please ask a parent or guardian before using nestgh..

## Lines 981-1002: 4. Using NestGH to find accommodation

```html
<h2>4. Using NestGH to find accommodation</h2>
<p>
  NestGH is free for people searching for accommodation.
</p>
<ul>
  <li>Listings are provided by owners. We review listings before they are published, but we cannot check every detail, and we do not guarantee that any listing is accurate, complete, current or available.</li>
  <li>A <strong>Verified</strong> label means only the specific verification that NestGH says it completed (Phone, Identity or Property). It is not a guarantee about the room, the owner or any agreement.</li>
  <li>A "Confirmed" date shows when the owner last confirmed availability. The room may have been taken since.</li>
</ul>
<p>
  <strong>Stay safe.</strong> Please always:
</p>
<ul>
  <li>View the room in person, ideally with another person, before you pay anything</li>
  <li>Never pay rent, a deposit or any fee to someone you have not met and whose right to rent out the property you have not checked</li>
  <li>Ask for a written agreement and a receipt for every payment</li>
  <li>Be careful if someone pressures you to pay quickly, asks for payment by a method you do not trust, or refuses to let you view the room</li>
  <li>Report anything suspicious using the <strong>Report this listing</strong> button</li>
</ul>
<p>
  You contact owners and make any arrangement at your own risk.
</p>
```

This part writes the Terms and Conditions section called **4. Using NestGH to find accommodation**. In simple words, it talks about 4. using nestgh to find accommodation nestgh is free for people searching for accommodation. listings are provided by owners. we review listings before they are published, but we cannot check every detail, and we do not.... It also includes a bullet list of simple points.

## Lines 1003-1025: 5. Rules for owners who submit listings

```html
<h2>5. Rules for owners who submit listings</h2>
<p>
  If you submit a listing, you confirm and agree that:
</p>
<ul>
  <li>You are the owner, or you are authorised by the owner to advertise the accommodation</li>
  <li>All information you give is true, accurate and current, including prices, costs, what is included and not included, facilities, rules and availability</li>
  <li>The photos show the real accommodation as it is now, and you have the right to use them</li>
  <li>The room is genuinely available when you submit it, and you will tell us promptly if it is taken</li>
  <li>Your profile photograph is a clear photograph of you, and your phone and WhatsApp numbers are yours or those you are authorised to use</li>
  <li>You will respond honestly to seekers and to NestGH</li>
</ul>
<p>You must not:</p>
<ul>
  <li>Post false, misleading or duplicate listings, or use photos that are not of the accommodation</li>
  <li>Advertise a property that you are not authorised to advertise</li>
  <li>Ask seekers to pay money before they have seen the accommodation, or take money for a room that does not exist or is not available</li>
  <li>Include other people's personal information, or content that is unlawful, offensive or discriminatory</li>
  <li>Misuse NestGH, or try to avoid our review or security checks</li>
</ul>
<p>
  Your house rules, including who may stay, must follow Ghanaian law.
</p>
```

This part writes the Terms and Conditions section called **5. Rules for owners who submit listings**. In simple words, it talks about 5. rules for owners who submit listings if you submit a listing, you confirm and agree that: you are the owner, or you are authorised by the owner to advertise the accommodation all information you give is true,.... It also includes a bullet list of simple points.

## Lines 1026-1046: 6. Listing fee and payment

```html
<h2>6. Listing fee and payment</h2>
<p>
  Owners pay a <strong>one-time Standard listing fee</strong>, shown at checkout before you pay.
  There is only one package. There is no monthly subscription, no renewal fee, and no extra charge
  to keep a listing live while the room is genuinely available.
</p>
<p>
  Payments are processed by <strong>Paystack</strong>, using Mobile Money or card, and Paystack's
  own terms apply. We do not store your full card details or Mobile Money PIN.
</p>
<p>
  Paying the fee does <strong>not</strong> guarantee that your listing will be approved or published,
  and does not make you or your property "Verified".
</p>
<p>
  <strong>Refunds.</strong> If we reject your listing for a reason that is not your fault, or we
  cannot publish it, we will refund the listing fee. We will not refund the fee if the listing
  is rejected or removed because it is false or misleading, because you broke these Terms,
  or because you asked us to remove a listing that we had already approved. Contact us to ask
  for a refund and quote your listing reference number.
</p>
```

This part writes the Terms and Conditions section called **6. Listing fee and payment**. In simple words, it talks about 6. listing fee and payment owners pay a one-time standard listing fee, shown at checkout before you pay. there is only one package. there is no monthly subscription, no renewal fee, and no extra charge to keep a listing....

## Lines 1047-1057: 7. Review, approval and verification

```html
<h2>7. Review, approval and verification</h2>
<p>
  After payment, every listing is reviewed by NestGH. We may approve it, ask you to make changes,
  edit it, reject it, hide it, mark it unavailable, or remove it. Only approved listings are public.
  We may contact you to confirm information, and we may ask for more information.
</p>
<p>
  NestGH may show <strong>Phone Verified</strong>, <strong>Identity Verified</strong> and
  <strong>Property Verified</strong> statuses. We show a status only after we have completed
  that check, and we may remove it if we later find it is no longer correct.
</p>
```

This part writes the Terms and Conditions section called **7. Review, approval and verification**. In simple words, it talks about 7. review, approval and verification after payment, every listing is reviewed by nestgh. we may approve it, ask you to make changes, edit it, reject it, hide it, mark it unavailable, or remove it. only approved listings....

## Lines 1058-1067: 8. Availability and keeping listings fresh

```html
<h2>8. Availability and keeping listings fresh</h2>
<p>
  Owners must keep their listing up to date. We may contact owners to confirm that a room is still
  available, and confirming does not cost anything. You can mark your room as unavailable at any
  time by contacting us.
</p>
<p>
  If a listing has not been confirmed for a long time, we may mark it as needing confirmation,
  move it down the results, mark it unavailable, or hide it until you confirm.
</p>
```

This part writes the Terms and Conditions section called **8. Availability and keeping listings fresh**. In simple words, it talks about 8. availability and keeping listings fresh owners must keep their listing up to date. we may contact owners to confirm that a room is still available, and confirming does not cost anything. you can mark your room as....

## Lines 1068-1078: 9. Agreements, rent and deposits

```html
<h2>9. Agreements, rent and deposits</h2>
<p>
  Any tenancy, rent, deposit, advance payment, fee or other agreement is between the seeker and
  the owner. NestGH is not responsible for it and cannot resolve disputes between them, although
  we may take action on reports about a listing. Owners and seekers are responsible for following
  the law that applies to renting accommodation in Ghana.
</p>
<p>
  The "estimated amount required to move in" shown on a listing is calculated from the figures the
  owner entered. It is only an estimate, and the owner is responsible for the figures being correct.
</p>
```

This part writes the Terms and Conditions section called **9. Agreements, rent and deposits**. In simple words, it talks about 9. agreements, rent and deposits any tenancy, rent, deposit, advance payment, fee or other agreement is between the seeker and the owner. nestgh is not responsible for it and cannot resolve disputes between them,....

## Lines 1079-1086: 10. Reports, removal and suspension

```html
<h2>10. Reports, removal and suspension</h2>
<p>
  Anyone can report a listing. We may investigate reports but do not have to investigate every report.
  We may hide, edit or remove any listing, and may suspend or block anyone from using NestGH, if we
  think a listing or a person breaks these Terms, is inaccurate or misleading, is unsafe, or is
  fraudulent, or if the law requires it. We may do this without refunding the listing fee where
  section 6 says so.
</p>
```

This part writes the Terms and Conditions section called **10. Reports, removal and suspension**. In simple words, it talks about 10. reports, removal and suspension anyone can report a listing. we may investigate reports but do not have to investigate every report. we may hide, edit or remove any listing, and may suspend or block anyone from....

## Lines 1087-1093: 11. Your content

```html
<h2>11. Your content</h2>
<p>
  You keep ownership of the text and photographs you submit. By submitting a listing you give NestGH
  a free, non-exclusive right to store, display, resize and use that content, and your name and profile
  photograph, on NestGH and in connection with promoting your listing, for as long as the listing is
  live and for a reasonable time afterwards. You confirm that you have the right to give us this permission.
</p>
```

This part writes the Terms and Conditions section called **11. Your content**. In simple words, it talks about 11. your content you keep ownership of the text and photographs you submit. by submitting a listing you give nestgh a free, non-exclusive right to store, display, resize and use that content, and your name and profile....

## Lines 1094-1099: 12. NestGH's intellectual property

```html
<h2>12. NestGH's intellectual property</h2>
<p>
  The NestGH name, logo, design, text and software belong to NestGH or its licensors.
  You may not copy, scrape, resell or reuse them without our written permission, except for
  normal personal use of the website.
</p>
```

This part writes the Terms and Conditions section called **12. NestGH's intellectual property**. In simple words, it talks about 12. nestgh's intellectual property the nestgh name, logo, design, text and software belong to nestgh or its licensors. you may not copy, scrape, resell or reuse them without our written permission, except for normal....

## Lines 1100-1108: 13. Disclaimers

```html
<h2>13. Disclaimers</h2>
<p>
  NestGH is provided "as is" and "as available". To the extent allowed by law, we do not promise that:
</p>
<ul>
  <li>Any listing, price, photo, description or availability is accurate or current</li>
  <li>Any owner or seeker is who they say they are, or will behave honestly or safely</li>
  <li>The website will always work without interruption or errors</li>
</ul>
```

This part writes the Terms and Conditions section called **13. Disclaimers**. In simple words, it talks about 13. disclaimers nestgh is provided "as is" and "as available". to the extent allowed by law, we do not promise that: any listing, price, photo, description or availability is accurate or current any owner or seeker is.... It also includes a bullet list of simple points.

## Lines 1109-1122: 14. Limits on our responsibility

```html
<h2>14. Limits on our responsibility</h2>
<p>
  To the extent allowed by law, NestGH is not responsible for loss or harm caused by owners,
  seekers or other third parties, by inaccurate or unavailable listings, by agreements or payments
  between seekers and owners, or by problems with third-party services such as Paystack, WhatsApp
  or your phone network.
</p>
<p>
  Where the law allows us to limit our responsibility, our total responsibility to you for any claim
  connected with NestGH will not be more than the listing fee you paid us in the 12 months before the
  claim (or, if you paid nothing, GH₵ 100). Nothing in these Terms removes any right you have under
  Ghanaian law that cannot be limited or excluded, such as responsibility for fraud or for death or
  personal injury caused by negligence.
</p>
```

This part writes the Terms and Conditions section called **14. Limits on our responsibility**. In simple words, it talks about 14. limits on our responsibility to the extent allowed by law, nestgh is not responsible for loss or harm caused by owners, seekers or other third parties, by inaccurate or unavailable listings, by agreements or....

## Lines 1123-1127: 15. Owners' responsibility

```html
<h2>15. Owners' responsibility</h2>
<p>
  If an owner breaks these Terms, for example by posting a false listing, the owner is responsible
  for the resulting losses and costs that NestGH or others suffer, to the extent allowed by law.
</p>
```

This part writes the Terms and Conditions section called **15. Owners' responsibility**. In simple words, it talks about 15. owners' responsibility if an owner breaks these terms, for example by posting a false listing, the owner is responsible for the resulting losses and costs that nestgh or others suffer, to the extent allowed by law..

## Lines 1128-1134: 16. Privacy and cookies

```html
<h2>16. Privacy and cookies</h2>
<p>
  We handle your personal information as described in our
  <a href="#" data-pol="privacy">Privacy Policy</a> ,
  <a href="#" data-pol="cookie">Cookie Policy</a> and
  <a href="#" data-pol="terms">Terms and Conditions</a>.
</p>
```

This part writes the Terms and Conditions section called **16. Privacy and cookies**. In simple words, it talks about 16. privacy and cookies we handle your personal information as described in our privacy policy , cookie policy and terms and conditions..

## Lines 1135-1140: 17. Changes to these Terms

```html
<h2>17. Changes to these Terms</h2>
<p>
  We may change these Terms from time to time, for example when our services or the law change.
  We will update the <strong>Last updated</strong> date and, if the change is significant, tell
  you on the website. If you keep using NestGH after a change, you accept the new Terms.
</p>
```

This part writes the Terms and Conditions section called **17. Changes to these Terms**. In simple words, it talks about 17. changes to these terms we may change these terms from time to time, for example when our services or the law change. we will update the last updated date and, if the change is significant, tell you on the website.....

## Lines 1141-1146: 18. Governing law and disputes

```html
<h2>18. Governing law and disputes</h2>
<p>
  These Terms are governed by the laws of the Republic of Ghana. If you have a problem, please
  contact us first so we can try to resolve it. If it cannot be resolved, the courts of Ghana
  have jurisdiction.
</p>
```

This part writes the Terms and Conditions section called **18. Governing law and disputes**. In simple words, it talks about 18. governing law and disputes these terms are governed by the laws of the republic of ghana. if you have a problem, please contact us first so we can try to resolve it. if it cannot be resolved, the courts of ghana....

## Lines 1147-1157: 19. Contact us

```html
<h2>19. Contact us</h2>
<p>
  <strong>Operated by:</strong> Brain Amponsah, trading as NestGH<br>
  <strong>Location:</strong> Accra, Ghana<br>
  <strong>Email:</strong>
  <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a><br>
  <strong>Phone:</strong>
  <a href="tel:0540309637">0540309637</a>
</p>
<p> &copy 2026 NestGH. All rights reserved.</p>
</template>
```

This part writes the Terms and Conditions section called **19. Contact us**. In simple words, it talks about 19. contact us operated by: brain amponsah, trading as nestgh location: accra, ghana email: amponsahbrain2007@gmail.com phone: 0540309637 © 2026 nestgh. all rights reserved.. It also includes contact details.

## Lines 1158-1166: Toast and script files

```html
<div class="toast" id="toast" role="status"></div>
<script defer src="font-loader.js"></script>
<script defer src="supabase-config.js"></script>
<script defer src="supabase.js"></script>
<script defer src="ghana-locations.js"></script>
<script defer src="commercial-listings.js"></script>
<script defer src="app.js"></script>
</body>
</html>
```

This last part adds a small toast message box for quick status notes, then loads the JavaScript files. The `script` tags are like telling extra helper workers when to come in and make the page interactive.

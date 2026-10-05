# styles.css explained like I'm 5

This file is like the paint, furniture spacing, and light-switch plan in a house.

## Tiny word guide

- **Selector**: the address label that tells CSS what to style.
- **Variable**: a saved value, like keeping the same paint color in a labeled jar.
- **Flexbox**: a layout helper for lining children up in a row or column.
- **Grid**: a layout helper for rows and columns, like graph paper.
- **Media query**: a rule that only wakes up in certain conditions, like small screens.
- **z-index**: the layer number that decides what sits on top.
- **Transition**: a gentle slide between old and new styles instead of a jump.

## Block 1 (lines 1-19): :root

```css
:root {
  --img: url(hero.webp);
  --bg: #f7f4ee;
  --card: #ffffff;
  --ink: #171614;
  --muted: #716b61;
  --line: #e7e0d5;
  --gold: #98721e;
  --tint: #f0e8d8;
  --fade: rgba(247, 244, 238, 0.9);
  --btn: #171614;
  --btn-ink: #ffffff;
  --brand: #9a772d;
  --g: linear-gradient(135deg, #f4e2a7, #d8b64f 55%, #b18a2e);
  --gi: #231d10;
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

A **selector** is like an address label that tells CSS which HTML pieces to dress up. A **variable** in CSS is like a labeled paint bucket so the same color or size can be reused in many places. This rule points to :root. It makes the variable `--img` hold `url(hero.webp)`; makes the variable `--bg` hold `#f7f4ee`; makes the variable `--card` hold `#ffffff`; makes the variable `--ink` hold `#171614`; makes the variable `--muted` hold `#716b61`; makes the variable `--line` hold `#e7e0d5`; makes the variable `--gold` hold `#98721e`; makes the variable `--tint` hold `#f0e8d8`. It also adds a few more tidy-up settings.

## Block 2 (lines 20-34): :root[data-theme="dark"]

```css
:root[data-theme="dark"] {
  --bg: #151513;
  --card: #211f1b;
  --ink: #f3efe7;
  --muted: #b6aea0;
  --line: #39352e;
  --gold: #e2c16a;
  --tint: #302b20;
  --fade: rgba(20, 19, 16, 0.94);
  --btn: #d8b64f;
  --btn-ink: #211b0d;
  --brand: #e2c16a;
  --g: linear-gradient(135deg, #f4e2a7, #d8b64f 55%, #b18a2e);
  --gi: #231d10;
}
```

This rule points to :root whose data-theme is "dark". It makes the variable `--bg` hold `#151513`; makes the variable `--card` hold `#211f1b`; makes the variable `--ink` hold `#f3efe7`; makes the variable `--muted` hold `#b6aea0`; makes the variable `--line` hold `#39352e`; makes the variable `--gold` hold `#e2c16a`; makes the variable `--tint` hold `#302b20`; makes the variable `--fade` hold `rgba(20, 19, 16, 0.94)`. It also adds a few more tidy-up settings.

## Block 3 (lines 35-37): html

```css
html {
  scroll-padding-top: env(safe-area-inset-top, 0px);
}
```

This rule points to html. It sets `scroll-padding-top` to `env(safe-area-inset-top, 0px)`.

## Block 4 (lines 38-40): *

```css
* {
  box-sizing: border-box;
}
```

This rule points to *. It sets `box-sizing` to `border-box`.

## Block 5 (lines 41-43): [hidden]

```css
[hidden] {
  display: none !important;
}
```

This rule points to things marked `hidden`. It sets `display` to `none !important`.

## Block 6 (lines 44-55): body

```css
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font:
    600 14px/1.4 "Bricolage Grotesque",
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
}
```

This rule points to body. It adds outside space of `0`; paints the background with `var(--bg)`; sets the text color to `var(--ink)`; shapes the text with `font: 600 14px/1.4 "Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

## Block 7 (lines 56-61): button, select, input

```css
button,
select,
input {
  font: inherit;
  color: inherit;
}
```

This rule points to button and  select and  input. It shapes the text with `font: inherit`; sets the text color to `inherit`.

## Block 8 (lines 62-65): :focus-visible

```css
:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}
```

This rule points to when keyboard focus is visible. It sets `outline` to `3px solid var(--gold)`; sets `outline-offset` to `2px`.

## Block 9 (lines 66-75): svg.i

```css
svg.i {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex: none;
}
```

This rule points to svgthings with class `i`. It sets `width` to `20px`; sets `height` to `20px`; sets `fill` to `none`; sets `stroke` to `currentColor`; sets `stroke-width` to `2`; sets `stroke-linecap` to `round`; sets `stroke-linejoin` to `round`; sets `flex` to `none`.

## Block 10 (lines 76-80): .w

```css
.w {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}
```

This rule points to things with class `w`. It sets `max-width` to `1100px`; adds outside space of `0 auto`; adds inside breathing room of `0 16px`.

## Block 11 (lines 81-86): nav

```css
nav {
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 3;
  color: var(--ink);
}
```

This rule points to nav. It uses `absolute` positioning so it can be placed very deliberately; positions it using `inset: 0 0 auto 0`; gives it layer number `3`, like deciding which paper sits on top; sets the text color to `var(--ink)`.

## Block 12 (lines 87-89): nav .logo small

```css
nav .logo small {
  color: var(--muted);
}
```

This rule points to nav things with class `logo` small. It sets the text color to `var(--muted)`.

## Block 13 (lines 90-95): nav .w

```css
nav .w {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}
```

This rule points to nav things with class `w`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; lines up children with `justify-content: space-between`; sets `height` to `68px`.

## Block 14 (lines 96-104): .logo

```css
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  font-size: 19px;
  letter-spacing: -0.4px;
  line-height: 1;
}
```

This rule points to things with class `logo`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `9px` between children; shapes the text with `font-weight: 800`; shapes the text with `font-size: 19px`; shapes the text with `letter-spacing: -0.4px`; shapes the text with `line-height: 1`.

## Block 15 (lines 105-113): .logo i

```css
.logo i {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--g);
  color: var(--gi);
  display: grid;
  place-items: center;
}
```

This rule points to things with class `logo` i. It sets `width` to `34px`; sets `height` to `34px`; rounds corners to `10px`; paints the background with `var(--g)`; sets the text color to `var(--gi)`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`.

## Block 16 (lines 114-121): .logo small

```css
.logo small {
  display: block;
  font-size: 9.5px;
  letter-spacing: 1.6px;
  color: var(--muted);
  margin-top: 3px;
  font-weight: 600;
}
```

This rule points to things with class `logo` small. It sets `display` to `block`; shapes the text with `font-size: 9.5px`; shapes the text with `letter-spacing: 1.6px`; sets the text color to `var(--muted)`; sets `margin-top` to `3px`; shapes the text with `font-weight: 600`.

## Block 17 (lines 122-127): .links

```css
.links {
  display: none;
  gap: 26px;
  font-size: 13.5px;
  font-weight: 800;
}
```

This rule points to things with class `links`. It hides it; leaves `26px` between children; shapes the text with `font-size: 13.5px`; shapes the text with `font-weight: 800`.

## Block 18 (lines 128-132): .links a

```css
.links a {
  color: inherit;
  text-decoration: none;
  padding: 6px 0;
}
```

This rule points to things with class `links` a. It sets the text color to `inherit`; sets `text-decoration` to `none`; adds inside breathing room of `6px 0`.

## Block 19 (lines 133-135): .links a:first-child

```css
.links a:first-child {
  border-bottom: 2px solid var(--gold);
}
```

This rule points to things with class `links` a when it is the first child. It sets `border-bottom` to `2px solid var(--gold)`.

## Block 20 (lines 136-151): .links.open

```css
.links.open {
  position: fixed;
  top: 68px;
  right: 16px;
  left: 16px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card);
  box-shadow: 0 14px 34px #0002;
  color: var(--ink);
}
```

This rule points to things with class `links`things with class `open`. It uses `fixed` positioning so it can be placed very deliberately; positions it using `top: 68px`; positions it using `right: 16px`; positions it using `left: 16px`; gives it layer number `5`, like deciding which paper sits on top; turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-direction` to `column`; leaves `0` between children. It also adds a few more tidy-up settings.

## Block 21 (lines 152-155): .links.open a

```css
.links.open a {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}
```

This rule points to things with class `links`things with class `open` a. It adds inside breathing room of `12px 0`; sets `border-bottom` to `1px solid var(--line)`.

## Block 22 (lines 156-158): .links.open a:last-child

```css
.links.open a:last-child {
  border-bottom: 0;
}
```

This rule points to things with class `links`things with class `open` a when it is the last child. It sets `border-bottom` to `0`.

## Block 23 (lines 159-163): .nr

```css
.nr {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

This rule points to things with class `nr`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `8px` between children.

## Block 24 (lines 164-166): .opts select.open

```css
.opts select.open {
  display: block;
}
```

This rule points to things with class `opts` selectthings with class `open`. It sets `display` to `block`.

## Block 25 (lines 167-169): body.modal-open

```css
body.modal-open {
  overflow: hidden;
}
```

This rule points to bodythings with class `modal-open`. It controls spillover with `hidden`.

## Block 26 (lines 170-183): .btn

```css
.btn {
  border: 0;
  border-radius: 999px;
  background: var(--btn);
  color: var(--btn-ink);
  font-weight: 800;
  font-size: 13px;
  height: 40px;
  padding: 0 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

This rule points to things with class `btn`. It draws a border of `0`; rounds corners to `999px`; paints the background with `var(--btn)`; sets the text color to `var(--btn-ink)`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 13px`; sets `height` to `40px`; adds inside breathing room of `0 18px`. It also adds a few more tidy-up settings.

## Block 27 (lines 184-186): .links-btn

```css
.links-btn {
  padding: 0 13px;
}
```

This rule points to things with class `links-btn`. It adds inside breathing room of `0 13px`.

## Block 28 (lines 187-190): .btn.gold

```css
.btn.gold {
  background: var(--g);
  color: var(--gi);
}
```

This rule points to things with class `btn`things with class `gold`. It paints the background with `var(--g)`; sets the text color to `var(--gi)`.

## Block 29 (lines 191-202): .ib

```css
.ib {
  color: var(--ink);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  background: var(--card);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}
```

This rule points to things with class `ib`. It sets the text color to `var(--ink)`; sets `width` to `40px`; sets `height` to `40px`; rounds corners to `50%`; draws a border of `1.5px solid var(--line)`; paints the background with `var(--card)`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`. It also adds a few more tidy-up settings.

## Block 30 (lines 203-217): .hero

```css
.hero {
  color: var(--ink);
  position: relative;
  padding: 96px 0 70px;
  background:
    linear-gradient(
      90deg,
      var(--bg) 0%,
      color-mix(in srgb, var(--bg) 94%, transparent) 36%,
      color-mix(in srgb, var(--bg) 48%, transparent) 58%,
      transparent 78%
    ),
    var(--img) right 24% / cover no-repeat var(--bg);
  min-height: 520px;
}
```

This rule points to things with class `hero`. It sets the text color to `var(--ink)`; uses `relative` positioning so it can be placed very deliberately; adds inside breathing room of `96px 0 70px`; paints the background with `linear-gradient( 90deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 94%, transparent) 36%, color-mix(in srgb, var(--bg) 48%, transparent) 58%, transparent 78% ), var(--img) right 24% / cover no-repeat var(--bg)`; sets `min-height` to `520px`.

## Block 31 (lines 218-224): .eyebrow

```css
.eyebrow {
  color: var(--gold);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.3px;
  margin: 0 0 8px;
}
```

This rule points to things with class `eyebrow`. It sets the text color to `var(--gold)`; shapes the text with `font-size: 12.5px`; shapes the text with `font-weight: 800`; shapes the text with `letter-spacing: 0.3px`; adds outside space of `0 0 8px`.

## Block 32 (lines 225-231): .hero h1

```css
.hero h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.08;
  letter-spacing: -1px;
  font-weight: 800;
}
```

This rule points to things with class `hero` h1. It adds outside space of `0`; shapes the text with `font-size: 32px`; shapes the text with `line-height: 1.08`; shapes the text with `letter-spacing: -1px`; shapes the text with `font-weight: 800`.

## Block 33 (lines 232-238): .script

```css
.script {
  font:
    700 34px/1 Caveat,
    cursive;
  color: var(--gold);
  margin: 4px 0 12px;
}
```

This rule points to things with class `script`. It shapes the text with `font: 700 34px/1 Caveat, cursive`; sets the text color to `var(--gold)`; adds outside space of `4px 0 12px`.

## Block 34 (lines 239-245): .hero p.d

```css
.hero p.d {
  margin: 0;
  font-size: 13.5px;
  max-width: 34ch;
  color: var(--muted);
  font-weight: 700;
}
```

This rule points to things with class `hero` pthings with class `d`. It adds outside space of `0`; shapes the text with `font-size: 13.5px`; sets `max-width` to `34ch`; sets the text color to `var(--muted)`; shapes the text with `font-weight: 700`.

## Block 35 (lines 246-257): .search

```css
.search {
  position: relative;
  z-index: 2;
  margin-top: -58px;
  background: var(--card);
  border-radius: 20px;
  padding: 14px;
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  box-shadow: 0 14px 34px #0002;
}
```

This rule points to things with class `search`. It uses `relative` positioning so it can be placed very deliberately; gives it layer number `2`, like deciding which paper sits on top; sets `margin-top` to `-58px`; paints the background with `var(--card)`; rounds corners to `20px`; adds inside breathing room of `14px`; turns on **grid**, which lays children out like boxes on graph paper; leaves `10px` between children. It also adds a few more tidy-up settings.

## Block 36 (lines 258-260): .town-control

```css
.town-control {
  position: relative;
}
```

This rule points to things with class `town-control`. It uses `relative` positioning so it can be placed very deliberately.

## Block 37 (lines 261-263): .town-field

```css
.town-field {
  min-width: 0;
}
```

This rule points to things with class `town-field`. It sets `min-width` to `0`.

## Block 38 (lines 264-277): .town-suggestions

```css
.town-suggestions {
  position: absolute;
  z-index: 8;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: min(300px, 55vh);
  overflow: auto;
  padding: 5px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card);
  box-shadow: 0 14px 34px #0003;
}
```

This rule points to things with class `town-suggestions`. It uses `absolute` positioning so it can be placed very deliberately; gives it layer number `8`, like deciding which paper sits on top; positions it using `top: calc(100% + 6px)`; positions it using `left: 0`; positions it using `right: 0`; sets `max-height` to `min(300px, 55vh)`; controls spillover with `auto`; adds inside breathing room of `5px`. It also adds a few more tidy-up settings.

## Block 39 (lines 278-290): .town-suggestions button

```css
.town-suggestions button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
  border: 0;
  border-radius: 9px;
  padding: 9px 10px;
  background: transparent;
  cursor: pointer;
}
```

This rule points to things with class `town-suggestions` button. It sets `width` to `100%`; turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; lines up children with `justify-content: space-between`; leaves `10px` between children; sets `text-align` to `left`; draws a border of `0`; rounds corners to `9px`. It also adds a few more tidy-up settings.

## Block 40 (lines 291-294): .town-suggestions button:hover, .town-suggestions button:focus-visible

```css
.town-suggestions button:hover,
.town-suggestions button:focus-visible {
  background: var(--tint);
}
```

This rule points to things with class `town-suggestions` button while it is being hovered and  things with class `town-suggestions` button when keyboard focus is visible. It paints the background with `var(--tint)`.

## Block 41 (lines 295-297): .town-suggestions button span

```css
.town-suggestions button span {
  font-weight: 800;
}
```

This rule points to things with class `town-suggestions` button span. It shapes the text with `font-weight: 800`.

## Block 42 (lines 298-303): .town-suggestions button small

```css
.town-suggestions button small {
  flex: none;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}
```

This rule points to things with class `town-suggestions` button small. It sets `flex` to `none`; sets the text color to `var(--muted)`; shapes the text with `font-size: 11px`; shapes the text with `font-weight: 700`.

## Block 43 (lines 304-309): .location-status, .location-credit

```css
.location-status,
.location-credit {
  font-size: 12px;
  color: var(--muted);
  margin: 8px 2px 0;
}
```

This rule points to things with class `location-status` and  things with class `location-credit`. It shapes the text with `font-size: 12px`; sets the text color to `var(--muted)`; adds outside space of `8px 2px 0`.

## Block 44 (lines 310-313): .location-status

```css
.location-status {
  color: #b43832;
  font-weight: 800;
}
```

This rule points to things with class `location-status`. It sets the text color to `#b43832`; shapes the text with `font-weight: 800`.

## Block 45 (lines 314-317): .location-credit a

```css
.location-credit a {
  color: var(--gold);
  font-weight: 800;
}
```

This rule points to things with class `location-credit` a. It sets the text color to `var(--gold)`; shapes the text with `font-weight: 800`.

## Block 46 (lines 318-326): .f label

```css
.f label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--muted);
  font-weight: 800;
  margin-bottom: 3px;
}
```

This rule points to things with class `f` label. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `6px` between children; shapes the text with `font-size: 11.5px`; sets the text color to `var(--muted)`; shapes the text with `font-weight: 800`; sets `margin-bottom` to `3px`.

## Block 47 (lines 327-336): .f select, .f input

```css
.f select,
.f input {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: var(--bg);
  padding: 0 12px;
  font-weight: 700;
}
```

This rule points to things with class `f` select and  things with class `f` input. It sets `width` to `100%`; sets `height` to `44px`; rounds corners to `12px`; draws a border of `1.5px solid var(--line)`; paints the background with `var(--bg)`; adds inside breathing room of `0 12px`; shapes the text with `font-weight: 700`.

## Block 48 (lines 337-351): .go

```css
.go {
  height: 46px;
  border: 0;
  border-radius: 999px;
  background: var(--g);
  color: var(--gi);
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 26px;
}
```

This rule points to things with class `go`. It sets `height` to `46px`; draws a border of `0`; rounds corners to `999px`; paints the background with `var(--g)`; sets the text color to `var(--gi)`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 14px`; changes the mouse pointer to `pointer`. It also adds a few more tidy-up settings.

## Block 49 (lines 352-354): .hero .eyebrow

```css
.hero .eyebrow {
  color: var(--gold);
}
```

This rule points to things with class `hero` things with class `eyebrow`. It sets the text color to `var(--gold)`.

## Block 50 (lines 355-359): .trust

```css
.trust {
  background: var(--card);
  border-bottom: 1px solid var(--line);
  margin-top: 24px;
}
```

This rule points to things with class `trust`. It paints the background with `var(--card)`; sets `border-bottom` to `1px solid var(--line)`; sets `margin-top` to `24px`.

## Block 51 (lines 360-363): .go

```css
.go {
  background: #171614;
  color: #fff;
}
```

This rule points to things with class `go`. It paints the background with `#171614`; sets the text color to `#fff`.

## Block 52 (lines 364-366): .go:hover

```css
.go:hover {
  background: #302d28;
}
```

This rule points to things with class `go` while it is being hovered. It paints the background with `#302d28`.

## Block 53 (lines 367-373): .trust .w

```css
.trust .w {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 12px;
  padding-top: 26px;
  padding-bottom: 26px;
}
```

This rule points to things with class `trust` things with class `w`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `1fr 1fr`; leaves `22px 12px` between children; sets `padding-top` to `26px`; sets `padding-bottom` to `26px`.

## Block 54 (lines 374-376): .tr

```css
.tr {
  text-align: center;
}
```

This rule points to things with class `tr`. It sets `text-align` to `center`.

## Block 55 (lines 377-386): .tr i

```css
.tr i {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--tint);
  color: var(--brand);
  display: grid;
  place-items: center;
  margin: 0 auto 8px;
}
```

This rule points to things with class `tr` i. It sets `width` to `52px`; sets `height` to `52px`; rounds corners to `50%`; paints the background with `var(--tint)`; sets the text color to `var(--brand)`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; adds outside space of `0 auto 8px`.

## Block 56 (lines 387-391): .tr b

```css
.tr b {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
}
```

This rule points to things with class `tr` b. It sets `display` to `block`; shapes the text with `font-size: 13.5px`; shapes the text with `font-weight: 800`.

## Block 57 (lines 392-398): .tr span

```css
.tr span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
  margin-top: 2px;
}
```

This rule points to things with class `tr` span. It sets `display` to `block`; shapes the text with `font-size: 12px`; sets the text color to `var(--muted)`; shapes the text with `font-weight: 600`; sets `margin-top` to `2px`.

## Block 58 (lines 399-401): .sec

```css
.sec {
  padding: 34px 0 6px;
}
```

This rule points to things with class `sec`. It adds inside breathing room of `34px 0 6px`.

## Block 59 (lines 402-408): .head

```css
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
```

This rule points to things with class `head`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: flex-end`; lines up children with `justify-content: space-between`; leaves `12px` between children; sets `margin-bottom` to `16px`.

## Block 60 (lines 409-414): .head h2

```css
.head h2 {
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.6px;
  font-weight: 800;
}
```

This rule points to things with class `head` h2. It adds outside space of `0`; shapes the text with `font-size: 22px`; shapes the text with `letter-spacing: -0.6px`; shapes the text with `font-weight: 800`.

## Block 61 (lines 415-426): .head button

```css
.head button {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  background: none;
  border: 0;
  padding: 0;
}
```

This rule points to things with class `head` button. It shapes the text with `font-size: 12.5px`; shapes the text with `font-weight: 800`; sets the text color to `var(--ink)`; turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `6px` between children; changes the mouse pointer to `pointer`; paints the background with `none`. It also adds a few more tidy-up settings.

## Block 62 (lines 427-430): .grid

```css
.grid {
  display: grid;
  gap: 16px;
}
```

This rule points to things with class `grid`. It turns on **grid**, which lays children out like boxes on graph paper; leaves `16px` between children.

## Block 63 (lines 431-438): .card

```css
.card {
  background: var(--card);
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
}
```

This rule points to things with class `card`. It paints the background with `var(--card)`; rounds corners to `18px`; controls spillover with `hidden`; draws a border of `1px solid var(--line)`; turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-direction` to `column`.

## Block 64 (lines 439-442): .pic

```css
.pic {
  height: 170px;
  position: relative;
}
```

This rule points to things with class `pic`. It sets `height` to `170px`; uses `relative` positioning so it can be placed very deliberately.

## Block 65 (lines 443-449): .pic svg, .pic > img

```css
.pic svg,
.pic > img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
```

This rule points to things with class `pic` svg and  things with class `pic`  directly inside  img. It sets `width` to `100%`; sets `height` to `100%`; sets `display` to `block`; tells pictures how to fill their box using `cover`.

## Block 66 (lines 450-460): .sr-only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

This rule points to things with class `sr-only`. It uses `absolute` positioning so it can be placed very deliberately; sets `width` to `1px`; sets `height` to `1px`; adds inside breathing room of `0`; adds outside space of `-1px`; controls spillover with `hidden`; sets `clip` to `rect(0, 0, 0, 0)`; sets `white-space` to `nowrap`. It also adds a few more tidy-up settings.

## Block 67 (lines 461-463): .skeleton-card

```css
.skeleton-card {
  pointer-events: none;
}
```

This rule points to things with class `skeleton-card`. It sets `pointer-events` to `none`.

## Block 68 (lines 464-467): .skeleton-image

```css
.skeleton-image {
  height: 170px;
  flex: none;
}
```

This rule points to things with class `skeleton-image`. It sets `height` to `170px`; sets `flex` to `none`.

## Block 69 (lines 468-474): .skeleton-body

```css
.skeleton-body {
  padding: 14px;
  display: grid;
  gap: 9px;
  flex: 1;
  align-content: start;
}
```

This rule points to things with class `skeleton-body`. It adds inside breathing room of `14px`; turns on **grid**, which lays children out like boxes on graph paper; leaves `9px` between children; sets `flex` to `1`; sets `align-content` to `start`.

## Block 70 (lines 475-487): .skel

```css
.skel {
  display: block;
  border-radius: 7px;
  background-color: var(--line);
  background-image: linear-gradient(
    100deg,
    var(--line) 30%,
    color-mix(in srgb, var(--line) 50%, var(--card)) 50%,
    var(--line) 70%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.8s ease-in-out infinite;
}
```

This rule points to things with class `skel`. It sets `display` to `block`; rounds corners to `7px`; sets `background-color` to `var(--line)`; sets `background-image` to `linear-gradient( 100deg, var(--line) 30%, color-mix(in srgb, var(--line) 50%, var(--card)) 50%, var(--line) 70% )`; sets `background-size` to `200% 100%`; starts an animation called `skeleton-shimmer 1.8s ease-in-out infinite`.

## Block 71 (lines 488-491): .skeleton-title

```css
.skeleton-title {
  width: 72%;
  height: 17px;
}
```

This rule points to things with class `skeleton-title`. It sets `width` to `72%`; sets `height` to `17px`.

## Block 72 (lines 492-495): .skeleton-location

```css
.skeleton-location {
  width: 48%;
  height: 13px;
}
```

This rule points to things with class `skeleton-location`. It sets `width` to `48%`; sets `height` to `13px`.

## Block 73 (lines 496-500): .skeleton-facility

```css
.skeleton-facility {
  width: 64%;
  height: 22px;
  border-radius: 8px;
}
```

This rule points to things with class `skeleton-facility`. It sets `width` to `64%`; sets `height` to `22px`; rounds corners to `8px`.

## Block 74 (lines 501-505): .skeleton-price

```css
.skeleton-price {
  width: 36%;
  height: 21px;
  margin-top: 7px;
}
```

This rule points to things with class `skeleton-price`. It sets `width` to `36%`; sets `height` to `21px`; sets `margin-top` to `7px`.

## Block 75 (lines 506-509): .skeleton-meta

```css
.skeleton-meta {
  width: 52%;
  height: 14px;
}
```

This rule points to things with class `skeleton-meta`. It sets `width` to `52%`; sets `height` to `14px`.

## Block 76 (lines 510-514): .load-more-wrap

```css
.load-more-wrap {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}
```

This rule points to things with class `load-more-wrap`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: center`; adds inside breathing room of `16px 0 8px`.

## Block 77 (lines 515-519): @keyframes skeleton-shimmer

```css
@keyframes skeleton-shimmer {
  to {
    background-position-x: -200%;
  }
}
```

This block defines the animation named `skeleton-shimmer`. Think of it like a tiny flipbook that tells the page how something should move or shimmer over time.

## Block 78 (lines 520-525): @media (prefers-reduced-motion: reduce)

```css
@media (prefers-reduced-motion: reduce) {
  .skel {
    animation: none;
    background: var(--line);
  }
}
```

A **media query** is like a school rule that only wakes up in certain situations, such as a bigger screen or reduced motion. This block only runs when `(prefers-reduced-motion: reduce)` is true. Inside it, the file changes `.skel`.

## Block 79 (lines 527-529): .shops-page

```css
.shops-page {
  background: transparent;
}
```

This rule points to things with class `shops-page`. It paints the background with `transparent`.

## Block 80 (lines 531-538): .shops-page .shops-breadcrumb

```css
.shops-page .shops-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px;
  color: var(--muted);
  font-size: 13px;
}
```

This rule points to things with class `shops-page` things with class `shops-breadcrumb`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `10px` between children; adds outside space of `0 0 18px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`.

## Block 81 (lines 540-547): .shops-breadcrumb a

```css
.shops-breadcrumb a {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  color: var(--green-700);
  font-weight: 700;
  text-decoration: none;
}
```

This rule points to things with class `shops-breadcrumb` a. It sets `min-height` to `40px`; sets `display` to `inline-flex`; lines up children with `align-items: center`; sets the text color to `var(--green-700)`; shapes the text with `font-weight: 700`; sets `text-decoration` to `none`.

## Block 82 (lines 549-552): .shops-heading

```css
.shops-heading {
  align-items: flex-end;
  margin-bottom: 22px;
}
```

This rule points to things with class `shops-heading`. It lines up children with `align-items: flex-end`; sets `margin-bottom` to `22px`.

## Block 83 (lines 554-557): .shops-heading h2

```css
.shops-heading h2 {
  margin: 0;
  color: var(--ink);
}
```

This rule points to things with class `shops-heading` h2. It adds outside space of `0`; sets the text color to `var(--ink)`.

## Block 84 (lines 559-563): .shops-intro

```css
.shops-intro {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 16px;
}
```

This rule points to things with class `shops-intro`. It adds outside space of `8px 0 0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 16px`.

## Block 85 (lines 565-575): .shops-filters

```css
.shops-filters {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: end;
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
  box-shadow: 0 2px 12px rgba(23, 22, 20, 0.05);
}
```

This rule points to things with class `shops-filters`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(5, minmax(0, 1fr))`; lines up children with `align-items: end`; leaves `14px` between children; adds inside breathing room of `20px`; draws a border of `1px solid var(--line)`; rounds corners to `18px`; paints the background with `var(--card)`. It also adds a few more tidy-up settings.

## Block 86 (lines 577-582): .shops-filters .f

```css
.shops-filters .f {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}
```

This rule points to things with class `shops-filters` things with class `f`. It sets `min-width` to `0`; adds inside breathing room of `0`; adds outside space of `0`; draws a border of `0`.

## Block 87 (lines 584-586): .shops-filters .f label

```css
.shops-filters .f label {
  min-height: 24px;
}
```

This rule points to things with class `shops-filters` things with class `f` label. It sets `min-height` to `24px`.

## Block 88 (lines 588-594): .shops-filters .f input, .shops-filters .f select

```css
.shops-filters .f input,
.shops-filters .f select {
  height: 48px;
  padding: 0 11px;
  border: 1px solid var(--line);
  background: var(--bg);
}
```

This rule points to things with class `shops-filters` things with class `f` input and  things with class `shops-filters` things with class `f` select. It sets `height` to `48px`; adds inside breathing room of `0 11px`; draws a border of `1px solid var(--line)`; paints the background with `var(--bg)`.

## Block 89 (lines 596-601): .shops-filters .go, .shops-filters .shops-clear

```css
.shops-filters .go,
.shops-filters .shops-clear {
  width: 100%;
  min-height: 48px;
  margin: 0;
}
```

This rule points to things with class `shops-filters` things with class `go` and  things with class `shops-filters` things with class `shops-clear`. It sets `width` to `100%`; sets `min-height` to `48px`; adds outside space of `0`.

## Block 90 (lines 603-605): .shops-clear

```css
.shops-clear {
  color: var(--green-700);
}
```

This rule points to things with class `shops-clear`. It sets the text color to `var(--green-700)`.

## Block 91 (lines 607-612): .shops-state

```css
.shops-state {
  min-height: 24px;
  margin: 18px 2px 14px;
  color: var(--muted);
  font-size: 14px;
}
```

This rule points to things with class `shops-state`. It sets `min-height` to `24px`; adds outside space of `18px 2px 14px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 14px`.

## Block 92 (lines 614-618): .commercial-grid

```css
.commercial-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
```

This rule points to things with class `commercial-grid`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(3, minmax(0, 1fr))`; leaves `18px` between children.

## Block 93 (lines 620-629): .commercial-card

```css
.commercial-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
  box-shadow: 0 2px 12px rgba(23, 22, 20, 0.06);
  transition: transform 180ms ease, border-color 180ms ease;
  animation: listing-card-enter 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

This rule points to things with class `commercial-card`. It sets `min-width` to `0`; controls spillover with `hidden`; draws a border of `1px solid var(--line)`; rounds corners to `16px`; paints the background with `var(--card)`; adds a shadow of `0 2px 12px rgba(23, 22, 20, 0.06)`; makes changes happen smoothly with `transform 180ms ease, border-color 180ms ease`; starts an animation called `listing-card-enter 380ms cubic-bezier(0.22, 1, 0.36, 1) both`.

## Block 94 (lines 630-630): .commercial-card:nth-child(2)

```css
.commercial-card:nth-child(2) { animation-delay: 45ms; }
```

This rule points to things with class `commercial-card` when it is child number 2. It sets `animation-delay` to `45ms`.

## Block 95 (lines 631-631): .commercial-card:nth-child(3)

```css
.commercial-card:nth-child(3) { animation-delay: 90ms; }
```

This rule points to things with class `commercial-card` when it is child number 3. It sets `animation-delay` to `90ms`.

## Block 96 (lines 632-632): .commercial-card:nth-child(4)

```css
.commercial-card:nth-child(4) { animation-delay: 135ms; }
```

This rule points to things with class `commercial-card` when it is child number 4. It sets `animation-delay` to `135ms`.

## Block 97 (lines 633-635): #list .card

```css
#list .card {
  animation: listing-card-enter 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

This rule points to the one with id `list` things with class `card`. It starts an animation called `listing-card-enter 380ms cubic-bezier(0.22, 1, 0.36, 1) both`.

## Block 98 (lines 636-636): #list .card:nth-child(2)

```css
#list .card:nth-child(2) { animation-delay: 45ms; }
```

This rule points to the one with id `list` things with class `card` when it is child number 2. It sets `animation-delay` to `45ms`.

## Block 99 (lines 637-637): #list .card:nth-child(3)

```css
#list .card:nth-child(3) { animation-delay: 90ms; }
```

This rule points to the one with id `list` things with class `card` when it is child number 3. It sets `animation-delay` to `90ms`.

## Block 100 (lines 638-638): #list .card:nth-child(4)

```css
#list .card:nth-child(4) { animation-delay: 135ms; }
```

This rule points to the one with id `list` things with class `card` when it is child number 4. It sets `animation-delay` to `135ms`.

## Block 101 (lines 640-645): .commercial-image

```css
.commercial-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--green-50);
}
```

This rule points to things with class `commercial-image`. It uses `relative` positioning so it can be placed very deliberately; controls spillover with `hidden`; sets `aspect-ratio` to `4 / 3`; paints the background with `var(--green-50)`.

## Block 102 (lines 647-653): .commercial-image > img

```css
.commercial-image > img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 400ms ease;
}
```

This rule points to things with class `commercial-image`  directly inside  img. It sets `width` to `100%`; sets `height` to `100%`; sets `display` to `block`; tells pictures how to fill their box using `cover`; makes changes happen smoothly with `transform 400ms ease`.

## Block 103 (lines 655-668): .commercial-placeholder

```css
.commercial-placeholder {
  width: 100%;
  height: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--green-50);
  color: var(--green-700);
  font-size: 13px;
  text-align: center;
}
```

This rule points to things with class `commercial-placeholder`. It sets `width` to `100%`; sets `height` to `100%`; sets `min-height` to `150px`; turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-direction` to `column`; lines up children with `align-items: center`; lines up children with `justify-content: center`; leaves `10px` between children. It also adds a few more tidy-up settings.

## Block 104 (lines 670-674): .commercial-placeholder svg

```css
.commercial-placeholder svg {
  width: 34px;
  height: 34px;
  stroke-width: 1.75;
}
```

This rule points to things with class `commercial-placeholder` svg. It sets `width` to `34px`; sets `height` to `34px`; sets `stroke-width` to `1.75`.

## Block 105 (lines 676-690): .commercial-type

```css
.commercial-type {
  position: absolute;
  top: 12px;
  left: 12px;
  max-width: calc(100% - 76px);
  overflow: hidden;
  padding: 6px 11px;
  border-radius: 999px;
  background: var(--green-900);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

This rule points to things with class `commercial-type`. It uses `absolute` positioning so it can be placed very deliberately; positions it using `top: 12px`; positions it using `left: 12px`; sets `max-width` to `calc(100% - 76px)`; controls spillover with `hidden`; adds inside breathing room of `6px 11px`; rounds corners to `999px`; paints the background with `var(--green-900)`. It also adds a few more tidy-up settings.

## Block 106 (lines 692-694): .commercial-save

```css
.commercial-save {
  z-index: 1;
}
```

This rule points to things with class `commercial-save`. It gives it layer number `1`, like deciding which paper sits on top.

## Block 107 (lines 696-702): .commercial-card-body

```css
.commercial-card-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 11px;
  padding: 16px;
}
```

This rule points to things with class `commercial-card-body`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-direction` to `column`; lines up children with `align-items: stretch`; leaves `11px` between children; adds inside breathing room of `16px`.

## Block 108 (lines 704-710): .commercial-card h3

```css
.commercial-card h3 {
  margin: 0;
  color: var(--ink);
  font-size: 17px;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
```

This rule points to things with class `commercial-card` h3. It adds outside space of `0`; sets the text color to `var(--ink)`; shapes the text with `font-size: 17px`; shapes the text with `line-height: 1.3`; sets `overflow-wrap` to `anywhere`.

## Block 109 (lines 712-720): .commercial-location

```css
.commercial-location {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  overflow-wrap: anywhere;
}
```

This rule points to things with class `commercial-location`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: flex-start`; leaves `7px` between children; adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`; sets `overflow-wrap` to `anywhere`.

## Block 110 (lines 722-727): .commercial-location svg

```css
.commercial-location svg {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  color: var(--green-600);
}
```

This rule points to things with class `commercial-location` svg. It sets `width` to `17px`; sets `height` to `17px`; sets `flex` to `0 0 17px`; sets the text color to `var(--green-600)`.

## Block 111 (lines 729-733): .commercial-facts

```css
.commercial-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
```

This rule points to things with class `commercial-facts`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; leaves `6px` between children.

## Block 112 (lines 735-743): .commercial-facts span

```css
.commercial-facts span {
  max-width: 100%;
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  font-size: 12px;
  overflow-wrap: anywhere;
}
```

This rule points to things with class `commercial-facts` span. It sets `max-width` to `100%`; adds inside breathing room of `4px 9px`; draws a border of `1px solid var(--line)`; rounds corners to `999px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`; sets `overflow-wrap` to `anywhere`.

## Block 113 (lines 745-750): .commercial-pricing

```css
.commercial-pricing {
  display: grid;
  gap: 7px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}
```

This rule points to things with class `commercial-pricing`. It turns on **grid**, which lays children out like boxes on graph paper; leaves `7px` between children; sets `padding-top` to `10px`; sets `border-top` to `1px solid var(--line)`.

## Block 114 (lines 752-760): .commercial-pricing p

```css
.commercial-pricing p {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
```

This rule points to things with class `commercial-pricing` p. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: baseline`; lines up children with `justify-content: space-between`; leaves `10px` between children; adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`.

## Block 115 (lines 762-765): .commercial-pricing b

```css
.commercial-pricing b {
  color: var(--ink);
  text-align: right;
}
```

This rule points to things with class `commercial-pricing` b. It sets the text color to `var(--ink)`; sets `text-align` to `right`.

## Block 116 (lines 767-770): .commercial-pricing .commercial-rent

```css
.commercial-pricing .commercial-rent {
  justify-content: flex-start;
  gap: 7px;
}
```

This rule points to things with class `commercial-pricing` things with class `commercial-rent`. It lines up children with `justify-content: flex-start`; leaves `7px` between children.

## Block 117 (lines 772-775): .commercial-pricing .commercial-rent b

```css
.commercial-pricing .commercial-rent b {
  color: var(--green-700);
  font-size: 21px;
}
```

This rule points to things with class `commercial-pricing` things with class `commercial-rent` b. It sets the text color to `var(--green-700)`; shapes the text with `font-size: 21px`.

## Block 118 (lines 777-780): .commercial-pricing .commercial-rent span

```css
.commercial-pricing .commercial-rent span {
  color: var(--muted);
  font-size: 13px;
}
```

This rule points to things with class `commercial-pricing` things with class `commercial-rent` span. It sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`.

## Block 119 (lines 782-785): .commercial-pricing .commercial-move-in

```css
.commercial-pricing .commercial-move-in {
  padding-top: 7px;
  border-top: 1px dashed var(--line);
}
```

This rule points to things with class `commercial-pricing` things with class `commercial-move-in`. It sets `padding-top` to `7px`; sets `border-top` to `1px dashed var(--line)`.

## Block 120 (lines 787-795): .commercial-availability

```css
.commercial-availability {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  overflow-wrap: anywhere;
}
```

This rule points to things with class `commercial-availability`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `7px` between children; adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`; sets `overflow-wrap` to `anywhere`.

## Block 121 (lines 797-803): .availability-dot

```css
.availability-dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: var(--green-600);
}
```

This rule points to things with class `availability-dot`. It sets `width` to `8px`; sets `height` to `8px`; sets `flex` to `0 0 8px`; rounds corners to `50%`; paints the background with `var(--green-600)`.

## Block 122 (lines 805-812): .commercial-details-button

```css
.commercial-details-button {
  width: 100%;
  min-height: 46px;
  margin-top: auto;
  border: 0;
  background: var(--green-600);
  color: #fff;
}
```

This rule points to things with class `commercial-details-button`. It sets `width` to `100%`; sets `min-height` to `46px`; sets `margin-top` to `auto`; draws a border of `0`; paints the background with `var(--green-600)`; sets the text color to `#fff`.

## Block 123 (lines 814-816): .commercial-details-button:hover

```css
.commercial-details-button:hover {
  background: var(--green-700);
}
```

This rule points to things with class `commercial-details-button` while it is being hovered. It paints the background with `var(--green-700)`.

## Block 124 (lines 818-821): .commercial-load-more

```css
.commercial-load-more {
  display: flex;
  margin: 22px auto 0;
}
```

This rule points to things with class `commercial-load-more`. It turns on **flexbox**, which lines children up like toys in a row or column; adds outside space of `22px auto 0`.

## Block 125 (lines 823-825): .commercial-load-more[hidden]

```css
.commercial-load-more[hidden] {
  display: none;
}
```

This rule points to things with class `commercial-load-more` things marked `hidden`. It hides it.

## Block 126 (lines 827-836): .shops-empty, .shops-error

```css
.shops-empty,
.shops-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
  padding: 34px 20px;
  color: var(--ink);
}
```

This rule points to things with class `shops-empty` and  things with class `shops-error`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-direction` to `column`; lines up children with `align-items: center`; leaves `10px` between children; adds outside space of `12px 0`; adds inside breathing room of `34px 20px`; sets the text color to `var(--ink)`.

## Block 127 (lines 838-841): .shops-empty[hidden], .shops-error[hidden]

```css
.shops-empty[hidden],
.shops-error[hidden] {
  display: none;
}
```

This rule points to things with class `shops-empty` things marked `hidden`  and  things with class `shops-error` things marked `hidden`. It hides it.

## Block 128 (lines 843-845): .shops-empty p

```css
.shops-empty p {
  margin: 0;
}
```

This rule points to things with class `shops-empty` p. It adds outside space of `0`.

## Block 129 (lines 847-855): .shops-empty-icon

```css
.shops-empty-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: var(--green-50);
  color: var(--green-600);
}
```

This rule points to things with class `shops-empty-icon`. It sets `width` to `52px`; sets `height` to `52px`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; rounds corners to `15px`; paints the background with `var(--green-50)`; sets the text color to `var(--green-600)`.

## Block 130 (lines 857-860): .shops-empty-icon svg

```css
.shops-empty-icon svg {
  width: 25px;
  height: 25px;
}
```

This rule points to things with class `shops-empty-icon` svg. It sets `width` to `25px`; sets `height` to `25px`.

## Block 131 (lines 862-864): .commercial-skeleton

```css
.commercial-skeleton {
  pointer-events: none;
}
```

This rule points to things with class `commercial-skeleton`. It sets `pointer-events` to `none`.

## Block 132 (lines 866-868): .commercial-skeleton .commercial-image

```css
.commercial-skeleton .commercial-image {
  height: auto;
}
```

This rule points to things with class `commercial-skeleton` things with class `commercial-image`. It sets `height` to `auto`.

## Block 133 (lines 870-872): .commercial-skeleton .skeleton-body

```css
.commercial-skeleton .skeleton-body {
  min-height: 148px;
}
```

This rule points to things with class `commercial-skeleton` things with class `skeleton-body`. It sets `min-height` to `148px`.

## Block 134 (lines 874-876): .commercial-skeleton .skeleton-price

```css
.commercial-skeleton .skeleton-price {
  width: 54%;
}
```

This rule points to things with class `commercial-skeleton` things with class `skeleton-price`. It sets `width` to `54%`.

## Block 135 (lines 878-880): .commercial-detail

```css
.commercial-detail {
  max-width: 720px;
}
```

This rule points to things with class `commercial-detail`. It sets `max-width` to `720px`.

## Block 136 (lines 882-886): .commercial-detail > h2, .commercial-detail > h3

```css
.commercial-detail > h2,
.commercial-detail > h3 {
  margin: 18px 0 8px;
  color: var(--ink);
}
```

This rule points to things with class `commercial-detail`  directly inside  h2 and  things with class `commercial-detail`  directly inside  h3. It adds outside space of `18px 0 8px`; sets the text color to `var(--ink)`.

## Block 137 (lines 888-890): .commercial-detail > h3

```css
.commercial-detail > h3 {
  font-size: 16px;
}
```

This rule points to things with class `commercial-detail`  directly inside  h3. It shapes the text with `font-size: 16px`.

## Block 138 (lines 892-896): .commercial-detail .commercial-description

```css
.commercial-detail .commercial-description {
  color: var(--muted);
  line-height: 1.65;
  overflow-wrap: anywhere;
}
```

This rule points to things with class `commercial-detail` things with class `commercial-description`. It sets the text color to `var(--muted)`; shapes the text with `line-height: 1.65`; sets `overflow-wrap` to `anywhere`.

## Block 139 (lines 898-902): .commercial-gallery

```css
.commercial-gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
```

This rule points to things with class `commercial-gallery`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(2, minmax(0, 1fr))`; leaves `8px` between children.

## Block 140 (lines 904-909): .commercial-gallery img

```css
.commercial-gallery img {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  object-fit: cover;
}
```

This rule points to things with class `commercial-gallery` img. It sets `width` to `100%`; sets `aspect-ratio` to `4 / 3`; rounds corners to `12px`; tells pictures how to fill their box using `cover`.

## Block 141 (lines 911-914): .commercial-details-placeholder

```css
.commercial-details-placeholder {
  min-height: 220px;
  border-radius: 14px;
}
```

This rule points to things with class `commercial-details-placeholder`. It sets `min-height` to `220px`; rounds corners to `14px`.

## Block 142 (lines 916-921): .commercial-contact

```css
.commercial-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
```

This rule points to things with class `commercial-contact`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; leaves `10px` between children; sets `margin-top` to `20px`.

## Block 143 (lines 923-928): .commercial-contact > a

```css
.commercial-contact > a {
  min-height: 46px;
  flex: 1 1 180px;
  justify-content: center;
  text-decoration: none;
}
```

This rule points to things with class `commercial-contact`  directly inside  a. It sets `min-height` to `46px`; sets `flex` to `1 1 180px`; lines up children with `justify-content: center`; sets `text-decoration` to `none`.

## Block 144 (lines 930-933): .commercial-contact .wa

```css
.commercial-contact .wa {
  background: var(--whatsapp);
  color: #07351c;
}
```

This rule points to things with class `commercial-contact` things with class `wa`. It paints the background with `var(--whatsapp)`; sets the text color to `#07351c`.

## Block 145 (lines 935-937): .commercial-call

```css
.commercial-call {
  color: var(--green-700);
}
```

This rule points to things with class `commercial-call`. It sets the text color to `var(--green-700)`.

## Block 146 (lines 939-943): @media (min-width: 1200px)

```css
@media (min-width: 1200px) {
  .commercial-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

This block only runs when `(min-width: 1200px)` is true. Inside it, the file changes `.commercial-grid`.

## Block 147 (lines 945-953): @media (max-width: 899px)

```css
@media (max-width: 899px) {
  .shops-filters {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .commercial-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

This block only runs when `(max-width: 899px)` is true. Inside it, the file changes `.shops-filters`, `.commercial-grid`.

## Block 148 (lines 955-993): @media (max-width: 639px)

```css
@media (max-width: 639px) {
  .shops-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 10px;
    padding: 14px;
  }

  .shops-filters .f input,
  .shops-filters .f select {
    padding: 0 9px;
  }

  .shops-filters .go,
  .shops-filters .shops-clear {
    grid-column: 1 / -1;
  }

  .commercial-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .commercial-card-body {
    padding: 15px;
  }

  .commercial-gallery {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .commercial-gallery img {
    width: min(82vw, 440px);
    flex: 0 0 min(82vw, 440px);
    scroll-snap-align: start;
  }
}
```

This block only runs when `(max-width: 639px)` is true. Inside it, the file changes `.shops-filters`, `.shops-filters .f select`, `.shops-filters .shops-clear`, `.commercial-grid`, `.commercial-card-body`, and more.

## Block 149 (lines 995-1000): @media (prefers-reduced-motion: reduce)

```css
@media (prefers-reduced-motion: reduce) {
  .commercial-card,
  .commercial-image > img {
    transition-duration: 0.01ms;
  }
}
```

This block only runs when `(prefers-reduced-motion: reduce)` is true. Inside it, the file changes `.commercial-image > img`.

## Block 150 (lines 1001-1005): .listing-photos

```css
.listing-photos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
```

This rule points to things with class `listing-photos`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(2, minmax(0, 1fr))`; leaves `8px` between children.

## Block 151 (lines 1006-1011): .listing-photos img

```css
.listing-photos img {
  width: 100%;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
}
```

This rule points to things with class `listing-photos` img. It sets `width` to `100%`; sets `height` to `150px`; rounds corners to `10px`; tells pictures how to fill their box using `cover`.

## Block 152 (lines 1012-1022): .ty

```css
.ty {
  position: absolute;
  left: 10px;
  top: 10px;
  background: #171614;
  color: #e6c96e;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 11px;
  border-radius: 999px;
}
```

This rule points to things with class `ty`. It uses `absolute` positioning so it can be placed very deliberately; positions it using `left: 10px`; positions it using `top: 10px`; paints the background with `#171614`; sets the text color to `#e6c96e`; shapes the text with `font-size: 11px`; shapes the text with `font-weight: 800`; adds inside breathing room of `5px 11px`. It also adds a few more tidy-up settings.

## Block 153 (lines 1023-1037): .hb

```css
.hb {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffffe6;
  color: #111;
  border: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}
```

This rule points to things with class `hb`. It uses `absolute` positioning so it can be placed very deliberately; positions it using `right: 10px`; positions it using `top: 10px`; sets `width` to `32px`; sets `height` to `32px`; rounds corners to `50%`; paints the background with `#ffffffe6`; sets the text color to `#111`. It also adds a few more tidy-up settings.

## Block 154 (lines 1038-1041): .hb svg

```css
.hb svg {
  width: 17px;
  height: 17px;
}
```

This rule points to things with class `hb` svg. It sets `width` to `17px`; sets `height` to `17px`.

## Block 155 (lines 1042-1045): .hb[aria-pressed="true"] svg

```css
.hb[aria-pressed="true"] svg {
  fill: #c0392b;
  stroke: #c0392b;
}
```

This rule points to things with class `hb` whose aria-pressed is "true"  svg. It sets `fill` to `#c0392b`; sets `stroke` to `#c0392b`.

## Block 156 (lines 1046-1052): .b

```css
.b {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
```

This rule points to things with class `b`. It adds inside breathing room of `14px`; turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-direction` to `column`; leaves `8px` between children; sets `flex` to `1`.

## Block 157 (lines 1053-1059): .b h3

```css
.b h3 {
  margin: 0;
  font-size: 15.5px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.2px;
}
```

This rule points to things with class `b` h3. It adds outside space of `0`; shapes the text with `font-size: 15.5px`; shapes the text with `font-weight: 800`; shapes the text with `line-height: 1.25`; shapes the text with `letter-spacing: -0.2px`.

## Block 158 (lines 1060-1067): .loc

```css
.loc {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}
```

This rule points to things with class `loc`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `5px` between children; sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`; shapes the text with `font-weight: 700`.

## Block 159 (lines 1068-1071): .loc svg

```css
.loc svg {
  width: 14px;
  height: 14px;
}
```

This rule points to things with class `loc` svg. It sets `width` to `14px`; sets `height` to `14px`.

## Block 160 (lines 1072-1076): .fac

```css
.fac {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
```

This rule points to things with class `fac`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `6px` between children; sets `flex-wrap` to `wrap`.

## Block 161 (lines 1077-1084): .fac span

```css
.fac span {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 3px 9px;
  font-size: 11.5px;
  font-weight: 700;
}
```

This rule points to things with class `fac` span. It paints the background with `var(--bg)`; draws a border of `1px solid var(--line)`; rounds corners to `8px`; adds inside breathing room of `3px 9px`; shapes the text with `font-size: 11.5px`; shapes the text with `font-weight: 700`.

## Block 162 (lines 1085-1089): .meta

```css
.meta {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--muted);
}
```

This rule points to things with class `meta`. It shapes the text with `font-size: 11.5px`; shapes the text with `font-weight: 700`; sets the text color to `var(--muted)`.

## Block 163 (lines 1090-1092): .meta b

```css
.meta b {
  color: var(--gold);
}
```

This rule points to things with class `meta` b. It sets the text color to `var(--gold)`.

## Block 164 (lines 1093-1101): .ft

```css
.ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-top: 1px solid var(--line);
  padding-top: 12px;
  margin-top: auto;
}
```

This rule points to things with class `ft`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; lines up children with `justify-content: space-between`; leaves `8px` between children; sets `border-top` to `1px solid var(--line)`; sets `padding-top` to `12px`; sets `margin-top` to `auto`.

## Block 165 (lines 1102-1106): .pr

```css
.pr {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
}
```

This rule points to things with class `pr`. It shapes the text with `font-size: 19px`; shapes the text with `font-weight: 800`; shapes the text with `letter-spacing: -0.4px`.

## Block 166 (lines 1107-1111): .pr small

```css
.pr small {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--muted);
}
```

This rule points to things with class `pr` small. It shapes the text with `font-size: 11.5px`; shapes the text with `font-weight: 700`; sets the text color to `var(--muted)`.

## Block 167 (lines 1112-1115): .acts

```css
.acts {
  display: flex;
  gap: 6px;
}
```

This rule points to things with class `acts`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `6px` between children.

## Block 168 (lines 1116-1125): .acts a

```css
.acts a {
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12.5px;
  text-decoration: none;
}
```

This rule points to things with class `acts` a. It sets `height` to `36px`; rounds corners to `999px`; turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; lines up children with `justify-content: center`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 12.5px`; sets `text-decoration` to `none`.

## Block 169 (lines 1126-1130): .wa

```css
.wa {
  background: var(--g);
  color: var(--gi);
  padding: 0 14px;
}
```

This rule points to things with class `wa`. It paints the background with `var(--g)`; sets the text color to `var(--gi)`; adds inside breathing room of `0 14px`.

## Block 170 (lines 1131-1135): .call

```css
.call {
  border: 1.5px solid var(--brand);
  color: var(--brand);
  width: 36px;
}
```

This rule points to things with class `call`. It draws a border of `1.5px solid var(--brand)`; sets the text color to `var(--brand)`; sets `width` to `36px`.

## Block 171 (lines 1136-1143): .empty

```css
.empty {
  grid-column: 1/-1;
  background: var(--card);
  border: 1.5px dashed var(--line);
  border-radius: 18px;
  padding: 26px 18px;
  text-align: center;
}
```

This rule points to things with class `empty`. It sets `grid-column` to `1/-1`; paints the background with `var(--card)`; draws a border of `1.5px dashed var(--line)`; rounds corners to `18px`; adds inside breathing room of `26px 18px`; sets `text-align` to `center`.

## Block 172 (lines 1144-1148): .empty b

```css
.empty b {
  display: block;
  font-size: 15px;
  margin-bottom: 4px;
}
```

This rule points to things with class `empty` b. It sets `display` to `block`; shapes the text with `font-size: 15px`; sets `margin-bottom` to `4px`.

## Block 173 (lines 1149-1153): .empty p

```css
.empty p {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 12.5px;
}
```

This rule points to things with class `empty` p. It adds outside space of `0 0 14px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12.5px`.

## Block 174 (lines 1154-1158): .why

```css
.why {
  display: grid;
  gap: 22px;
  align-items: center;
}
```

This rule points to things with class `why`. It turns on **grid**, which lays children out like boxes on graph paper; leaves `22px` between children; lines up children with `align-items: center`.

## Block 175 (lines 1159-1165): .wimg

```css
.wimg {
  height: 230px;
  border-radius: 20px;
  background: var(--img) center 45% / cover;
  position: relative;
  overflow: hidden;
}
```

This rule points to things with class `wimg`. It sets `height` to `230px`; rounds corners to `20px`; paints the background with `var(--img) center 45% / cover`; uses `relative` positioning so it can be placed very deliberately; controls spillover with `hidden`.

## Block 176 (lines 1166-1171): .wimg::after

```css
.wimg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--fade), transparent 70%);
}
```

This rule points to things with class `wimg`::after. It sets `content` to `""`; uses `absolute` positioning so it can be placed very deliberately; positions it using `inset: 0`; paints the background with `linear-gradient(90deg, var(--fade), transparent 70%)`.

## Block 177 (lines 1172-1183): .wimg span

```css
.wimg span {
  position: absolute;
  z-index: 1;
  left: 18px;
  top: 50%;
  transform: translateY(-50%) rotate(-5deg);
  font:
    700 30px/1.05 Caveat,
    cursive;
  color: var(--gold);
  max-width: 6ch;
}
```

This rule points to things with class `wimg` span. It uses `absolute` positioning so it can be placed very deliberately; gives it layer number `1`, like deciding which paper sits on top; positions it using `left: 18px`; positions it using `top: 50%`; moves or reshapes it with `translateY(-50%) rotate(-5deg)`; shapes the text with `font: 700 30px/1.05 Caveat, cursive`; sets the text color to `var(--gold)`; sets `max-width` to `6ch`.

## Block 178 (lines 1184-1189): .why h2

```css
.why h2 {
  margin: 0 0 8px;
  font-size: 22px;
  letter-spacing: -0.6px;
  font-weight: 800;
}
```

This rule points to things with class `why` h2. It adds outside space of `0 0 8px`; shapes the text with `font-size: 22px`; shapes the text with `letter-spacing: -0.6px`; shapes the text with `font-weight: 800`.

## Block 179 (lines 1190-1196): .why p

```css
.why p {
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 13.5px;
  font-weight: 600;
  max-width: 46ch;
}
```

This rule points to things with class `why` p. It adds outside space of `0 0 16px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13.5px`; shapes the text with `font-weight: 600`; sets `max-width` to `46ch`.

## Block 180 (lines 1197-1199): .stats

```css
.stats {
  display: flex;
}
```

This rule points to things with class `stats`. It turns on **flexbox**, which lines children up like toys in a row or column.

## Block 181 (lines 1200-1203): .stats div

```css
.stats div {
  padding: 0 16px;
  border-left: 1px solid var(--line);
}
```

This rule points to things with class `stats` div. It adds inside breathing room of `0 16px`; sets `border-left` to `1px solid var(--line)`.

## Block 182 (lines 1204-1207): .stats div:first-child

```css
.stats div:first-child {
  padding-left: 0;
  border: 0;
}
```

This rule points to things with class `stats` div when it is the first child. It sets `padding-left` to `0`; draws a border of `0`.

## Block 183 (lines 1208-1212): .stats b

```css
.stats b {
  display: block;
  font-size: 19px;
  font-weight: 800;
}
```

This rule points to things with class `stats` b. It sets `display` to `block`; shapes the text with `font-size: 19px`; shapes the text with `font-weight: 800`.

## Block 184 (lines 1213-1217): .stats span

```css
.stats span {
  font-size: 11.5px;
  color: var(--muted);
  font-weight: 700;
}
```

This rule points to things with class `stats` span. It shapes the text with `font-size: 11.5px`; sets the text color to `var(--muted)`; shapes the text with `font-weight: 700`.

## Block 185 (lines 1218-1226): .cta

```css
.cta {
  margin: 34px 0 0;
  border-radius: 22px;
  background:
    linear-gradient(90deg, #171614 0%, #171614e8 55%, #17161480),
    var(--img) center 40% / cover;
  color: #fff;
  padding: 26px 22px;
}
```

This rule points to things with class `cta`. It adds outside space of `34px 0 0`; rounds corners to `22px`; paints the background with `linear-gradient(90deg, #171614 0%, #171614e8 55%, #17161480), var(--img) center 40% / cover`; sets the text color to `#fff`; adds inside breathing room of `26px 22px`.

## Block 186 (lines 1227-1233): .cta h2

```css
.cta h2 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #e6c96e;
}
```

This rule points to things with class `cta` h2. It adds outside space of `0 0 6px`; shapes the text with `font-size: 22px`; shapes the text with `font-weight: 800`; shapes the text with `letter-spacing: -0.5px`; sets the text color to `#e6c96e`.

## Block 187 (lines 1234-1240): .cta p

```css
.cta p {
  margin: 0 0 16px;
  font-size: 13px;
  color: #e3ded4;
  max-width: 38ch;
  font-weight: 600;
}
```

This rule points to things with class `cta` p. It adds outside space of `0 0 16px`; shapes the text with `font-size: 13px`; sets the text color to `#e3ded4`; sets `max-width` to `38ch`; shapes the text with `font-weight: 600`.

## Block 188 (lines 1241-1243): footer

```css
footer {
  padding: 34px 0 26px;
}
```

This rule points to footer. It adds inside breathing room of `34px 0 26px`.

## Block 189 (lines 1244-1248): .fg

```css
.fg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 14px;
}
```

This rule points to things with class `fg`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `1fr 1fr`; leaves `24px 14px` between children.

## Block 190 (lines 1249-1253): .fg h3

```css
.fg h3 {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 800;
}
```

This rule points to things with class `fg` h3. It adds outside space of `0 0 10px`; shapes the text with `font-size: 13px`; shapes the text with `font-weight: 800`.

## Block 191 (lines 1254-1264): .fg a, .fg p

```css
.fg a,
.fg p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 12.5px;
  text-decoration: none;
  font-weight: 600;
}
```

This rule points to things with class `fg` a and  things with class `fg` p. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `8px` between children; adds outside space of `0 0 8px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12.5px`; sets `text-decoration` to `none`; shapes the text with `font-weight: 600`.

## Block 192 (lines 1265-1268): .soc

```css
.soc {
  display: flex;
  gap: 8px;
}
```

This rule points to things with class `soc`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `8px` between children.

## Block 193 (lines 1269-1280): .soc a

```css
.soc a {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--btn);
  color: var(--btn-ink);
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  margin: 0;
}
```

This rule points to things with class `soc` a. It sets `width` to `34px`; sets `height` to `34px`; rounds corners to `50%`; paints the background with `var(--btn)`; sets the text color to `var(--btn-ink)`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; shapes the text with `font-size: 11px`. It also adds a few more tidy-up settings.

## Block 194 (lines 1282-1292): .fb

```css
.fb {
  border-top: 1px solid var(--line);
  margin-top: 20px;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 11.5px;
  color: var(--muted);
}
```

This rule points to things with class `fb`. It sets `border-top` to `1px solid var(--line)`; sets `margin-top` to `20px`; sets `padding-top` to `16px`; turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; leaves `10px` between children; sets `flex-wrap` to `wrap`; shapes the text with `font-size: 11.5px`. It also adds a few more tidy-up settings.

## Block 195 (lines 1293-1296): .fb a

```css
.fb a {
  color: var(--muted);
  margin-left: 14px;
}
```

This rule points to things with class `fb` a. It sets the text color to `var(--muted)`; sets `margin-left` to `14px`.

## Block 196 (lines 1298-1313): .toast

```css
.toast {
  position: fixed;
  left: 50%;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  background: var(--ink);
  color: var(--bg);
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 9;
}
```

This rule points to things with class `toast`. It uses `fixed` positioning so it can be placed very deliberately; positions it using `left: 50%`; positions it using `bottom: calc(20px + env(safe-area-inset-bottom, 0px))`; moves or reshapes it with `translateX(-50%)`; paints the background with `var(--ink)`; sets the text color to `var(--bg)`; adds inside breathing room of `12px 18px`; rounds corners to `12px`. It also adds a few more tidy-up settings.

## Block 197 (lines 1314-1316): .toast.on

```css
.toast.on {
  opacity: 1;
}
```

This rule points to things with class `toast`things with class `on`. It makes it `1` see-through.

## Block 198 (lines 1317-1322): .st

```css
.st {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
}
```

This rule points to things with class `st`. It sets `display` to `inline-flex`; lines up children with `align-items: center`; leaves `6px` between children; shapes the text with `font-weight: 800`.

## Block 199 (lines 1323-1329): .st i

```css
.st i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22a06b;
  display: inline-block;
}
```

This rule points to things with class `st` i. It sets `width` to `9px`; sets `height` to `9px`; rounds corners to `50%`; paints the background with `#22a06b`; sets `display` to `inline-block`.

## Block 200 (lines 1330-1332): .st i.y

```css
.st i.y {
  background: #e0a526;
}
```

This rule points to things with class `st` ithings with class `y`. It paints the background with `#e0a526`.

## Block 201 (lines 1333-1335): .st i.w

```css
.st i.w {
  background: #e07b39;
}
```

This rule points to things with class `st` ithings with class `w`. It paints the background with `#e07b39`.

## Block 202 (lines 1336-1338): .st i.r

```css
.st i.r {
  background: #d64545;
}
```

This rule points to things with class `st` ithings with class `r`. It paints the background with `#d64545`.

## Block 203 (lines 1339-1341): .card

```css
.card {
  cursor: pointer;
}
```

This rule points to things with class `card`. It changes the mouse pointer to `pointer`.

## Block 204 (lines 1342-1344): .card.off

```css
.card.off {
  opacity: 0.62;
}
```

This rule points to things with class `card`things with class `off`. It makes it `0.62` see-through.

## Block 205 (lines 1345-1349): .gone

```css
.gone {
  font-size: 12.5px;
  font-weight: 800;
  color: #d64545;
}
```

This rule points to things with class `gone`. It shapes the text with `font-size: 12.5px`; shapes the text with `font-weight: 800`; sets the text color to `#d64545`.

## Block 206 (lines 1350-1355): .lk

```css
.lk {
  all: unset;
  cursor: pointer;
  font: inherit;
  color: inherit;
}
```

This rule points to things with class `lk`. It sets `all` to `unset`; changes the mouse pointer to `pointer`; shapes the text with `font: inherit`; sets the text color to `inherit`.

## Block 207 (lines 1356-1359): .lk:focus-visible

```css
.lk:focus-visible {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}
```

This rule points to things with class `lk` when keyboard focus is visible. It sets `outline` to `3px solid var(--gold)`; sets `outline-offset` to `2px`.

## Block 208 (lines 1360-1363): .near

```css
.near {
  grid-column: 1/-1;
  text-align: left;
}
```

This rule points to things with class `near`. It sets `grid-column` to `1/-1`; sets `text-align` to `left`.

## Block 209 (lines 1364-1367): .nl

```css
.nl {
  display: grid;
  gap: 8px;
}
```

This rule points to things with class `nl`. It turns on **grid**, which lays children out like boxes on graph paper; leaves `8px` between children.

## Block 210 (lines 1368-1375): .nb

```css
.nb {
  text-align: left;
  border: 1.5px solid var(--line);
  background: var(--bg);
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
}
```

This rule points to things with class `nb`. It sets `text-align` to `left`; draws a border of `1.5px solid var(--line)`; paints the background with `var(--bg)`; rounds corners to `14px`; adds inside breathing room of `10px 12px`; changes the mouse pointer to `pointer`.

## Block 211 (lines 1376-1379): .nb b

```css
.nb b {
  display: block;
  font-size: 14px;
}
```

This rule points to things with class `nb` b. It sets `display` to `block`; shapes the text with `font-size: 14px`.

## Block 212 (lines 1380-1384): .nb span

```css
.nb span {
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
}
```

This rule points to things with class `nb` span. It shapes the text with `font-size: 12px`; sets the text color to `var(--muted)`; shapes the text with `font-weight: 700`.

## Block 213 (lines 1385-1391): .opts

```css
.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 14px;
}
```

This rule points to things with class `opts`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; leaves `8px` between children; lines up children with `align-items: center`; sets `margin-top` to `14px`.

## Block 214 (lines 1392-1394): .opts > b

```css
.opts > b {
  font-size: 12px;
}
```

This rule points to things with class `opts`  directly inside  b. It shapes the text with `font-size: 12px`.

## Block 215 (lines 1395-1403): .mh

```css
.mh {
  border: 1.5px solid var(--line);
  background: var(--card);
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 12.5px;
  font-weight: 800;
  cursor: pointer;
}
```

This rule points to things with class `mh`. It draws a border of `1.5px solid var(--line)`; paints the background with `var(--card)`; rounds corners to `999px`; adds inside breathing room of `6px 13px`; shapes the text with `font-size: 12.5px`; shapes the text with `font-weight: 800`; changes the mouse pointer to `pointer`.

## Block 216 (lines 1404-1408): .mh[aria-pressed="true"]

```css
.mh[aria-pressed="true"] {
  background: var(--brand);
  border-color: var(--brand);
  color: var(--btn-ink);
}
```

This rule points to things with class `mh` whose aria-pressed is "true". It paints the background with `var(--brand)`; sets `border-color` to `var(--brand)`; sets the text color to `var(--btn-ink)`.

## Block 217 (lines 1409-1416): .stu

```css
.stu {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 800;
  margin-left: auto;
}
```

This rule points to things with class `stu`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `8px` between children; shapes the text with `font-size: 12.5px`; shapes the text with `font-weight: 800`; sets `margin-left` to `auto`.

## Block 218 (lines 1417-1426): .opts select

```css
.opts select {
  display: none;
  height: 34px;
  border-radius: 10px;
  border: 1.5px solid var(--line);
  background: var(--card);
  padding: 0 8px;
  font-weight: 700;
  max-width: 100%;
}
```

This rule points to things with class `opts` select. It hides it; sets `height` to `34px`; rounds corners to `10px`; draws a border of `1.5px solid var(--line)`; paints the background with `var(--card)`; adds inside breathing room of `0 8px`; shapes the text with `font-weight: 700`; sets `max-width` to `100%`.

## Block 219 (lines 1427-1435): .sheet

```css
.sheet {
  position: fixed;
  inset: 0;
  background: #000b;
  z-index: 20;
  display: none;
  align-items: flex-end;
  justify-content: center;
}
```

This rule points to things with class `sheet`. It uses `fixed` positioning so it can be placed very deliberately; positions it using `inset: 0`; paints the background with `#000b`; gives it layer number `20`, like deciding which paper sits on top; hides it; lines up children with `align-items: flex-end`; lines up children with `justify-content: center`.

## Block 220 (lines 1436-1438): .sheet.on

```css
.sheet.on {
  display: flex;
}
```

This rule points to things with class `sheet`things with class `on`. It turns on **flexbox**, which lines children up like toys in a row or column.

## Block 221 (lines 1439-1448): .sp

```css
.sp {
  position: relative;
  background: var(--card);
  width: 100%;
  max-width: 560px;
  max-height: 92vh;
  overflow: auto;
  border-radius: 22px 22px 0 0;
  padding: 14px 16px calc(28px + env(safe-area-inset-bottom, 0px));
}
```

This rule points to things with class `sp`. It uses `relative` positioning so it can be placed very deliberately; paints the background with `var(--card)`; sets `width` to `100%`; sets `max-width` to `560px`; sets `max-height` to `92vh`; controls spillover with `auto`; rounds corners to `22px 22px 0 0`; adds inside breathing room of `14px 16px calc(28px + env(safe-area-inset-bottom, 0px))`.

## Block 222 (lines 1449-1468): .x

```css
.x {
  position: sticky;
  top: 0;
  z-index: 3;
  display: block;
  width: calc(100% + 32px);
  margin: -14px -16px 12px;
  height: 44px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: var(--card);
  color: var(--ink);
  font:
    800 13px "Bricolage Grotesque",
    system-ui,
    sans-serif;
  text-align: right;
  padding: 0 16px;
  cursor: pointer;
}
```

This rule points to things with class `x`. It uses `sticky` positioning so it can be placed very deliberately; positions it using `top: 0`; gives it layer number `3`, like deciding which paper sits on top; sets `display` to `block`; sets `width` to `calc(100% + 32px)`; adds outside space of `-14px -16px 12px`; sets `height` to `44px`; draws a border of `0`. It also adds a few more tidy-up settings.

## Block 223 (lines 1469-1471): .x:focus-visible

```css
.x:focus-visible {
  outline-offset: -3px;
}
```

This rule points to things with class `x` when keyboard focus is visible. It sets `outline-offset` to `-3px`.

## Block 224 (lines 1472-1474): .sp:focus

```css
.sp:focus {
  outline: none;
}
```

This rule points to things with class `sp`:focus. It sets `outline` to `none`.

## Block 225 (lines 1475-1479): .fld > label.up

```css
.fld > label.up {
  display: inline-flex;
  margin: 0;
  font-size: 13px;
}
```

This rule points to things with class `fld`  directly inside  labelthings with class `up`. It sets `display` to `inline-flex`; adds outside space of `0`; shapes the text with `font-size: 13px`.

## Block 226 (lines 1480-1485): .pic.sm

```css
.pic.sm {
  height: 160px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 12px;
}
```

This rule points to things with class `pic`things with class `sm`. It sets `height` to `160px`; rounds corners to `14px`; controls spillover with `hidden`; sets `margin-bottom` to `12px`.

## Block 227 (lines 1486-1491): .sn

```css
.sn {
  margin: 0 0 4px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
```

This rule points to things with class `sn`. It adds outside space of `0 0 4px`; shapes the text with `font-size: 19px`; shapes the text with `font-weight: 800`; shapes the text with `letter-spacing: -0.3px`.

## Block 228 (lines 1492-1496): .sp h4

```css
.sp h4 {
  margin: 18px 0 6px;
  font-size: 14px;
  font-weight: 800;
}
```

This rule points to things with class `sp` h4. It adds outside space of `18px 0 6px`; shapes the text with `font-size: 14px`; shapes the text with `font-weight: 800`.

## Block 229 (lines 1497-1504): .kv div

```css
.kv div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
```

This rule points to things with class `kv` div. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; leaves `12px` between children; adds inside breathing room of `8px 0`; sets `border-bottom` to `1px solid var(--line)`; shapes the text with `font-size: 13px`.

## Block 230 (lines 1505-1507): .kv span

```css
.kv span {
  color: var(--muted);
}
```

This rule points to things with class `kv` span. It sets the text color to `var(--muted)`.

## Block 231 (lines 1508-1510): .kv b

```css
.kv b {
  text-align: right;
}
```

This rule points to things with class `kv` b. It sets `text-align` to `right`.

## Block 232 (lines 1511-1520): .tot

```css
.tot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--tint);
  border-radius: 12px;
  padding: 12px 14px;
  margin-top: 10px;
  font-weight: 800;
}
```

This rule points to things with class `tot`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; lines up children with `align-items: center`; paints the background with `var(--tint)`; rounds corners to `12px`; adds inside breathing room of `12px 14px`; sets `margin-top` to `10px`; shapes the text with `font-weight: 800`.

## Block 233 (lines 1521-1523): .tot b

```css
.tot b {
  font-size: 18px;
}
```

This rule points to things with class `tot` b. It shapes the text with `font-size: 18px`.

## Block 234 (lines 1524-1528): .tags

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
```

This rule points to things with class `tags`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; leaves `6px` between children.

## Block 235 (lines 1529-1536): .tags span

```css
.tags span {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}
```

This rule points to things with class `tags` span. It paints the background with `var(--bg)`; draws a border of `1px solid var(--line)`; rounds corners to `8px`; adds inside breathing room of `4px 10px`; shapes the text with `font-size: 12px`; shapes the text with `font-weight: 700`.

## Block 236 (lines 1537-1539): .tags.sep span

```css
.tags.sep span {
  border-color: #e0a526;
}
```

This rule points to things with class `tags`things with class `sep` span. It sets `border-color` to `#e0a526`.

## Block 237 (lines 1540-1542): .tags.no span

```css
.tags.no span {
  color: var(--muted);
}
```

This rule points to things with class `tags`things with class `no` span. It sets the text color to `var(--muted)`.

## Block 238 (lines 1543-1548): .np

```css
.np {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 700;
}
```

This rule points to things with class `np`. It adds outside space of `0 0 8px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12.5px`; shapes the text with `font-weight: 700`.

## Block 239 (lines 1549-1553): .mp

```css
.mp {
  color: var(--gold);
  font-weight: 800;
  font-size: 13px;
}
```

This rule points to things with class `mp`. It sets the text color to `var(--gold)`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 13px`.

## Block 240 (lines 1554-1556): .acts.big

```css
.acts.big {
  margin-top: 16px;
}
```

This rule points to things with class `acts`things with class `big`. It sets `margin-top` to `16px`.

## Block 241 (lines 1557-1560): .acts.big a

```css
.acts.big a {
  height: 44px;
  font-size: 14px;
}
```

This rule points to things with class `acts`things with class `big` a. It sets `height` to `44px`; shapes the text with `font-size: 14px`.

## Block 242 (lines 1561-1563): .acts.big .call

```css
.acts.big .call {
  width: 44px;
}
```

This rule points to things with class `acts`things with class `big` things with class `call`. It sets `width` to `44px`.

## Block 243 (lines 1564-1567): .rep

```css
.rep {
  display: flex;
  gap: 8px;
}
```

This rule points to things with class `rep`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `8px` between children.

## Block 244 (lines 1568-1576): .rep select

```css
.rep select {
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid var(--line);
  background: var(--bg);
  padding: 0 10px;
  font-weight: 700;
}
```

This rule points to things with class `rep` select. It sets `flex` to `1`; sets `height` to `40px`; rounds corners to `10px`; draws a border of `1.5px solid var(--line)`; paints the background with `var(--bg)`; adds inside breathing room of `0 10px`; shapes the text with `font-weight: 700`.

## Block 245 (lines 1577-1580): .property-details

```css
.property-details {
  max-width: 820px;
  padding: 0 22px calc(24px + env(safe-area-inset-bottom, 0px));
}
```

This rule points to things with class `property-details`. It sets `max-width` to `820px`; adds inside breathing room of `0 22px calc(24px + env(safe-area-inset-bottom, 0px))`.

## Block 246 (lines 1582-1586): .property-details .x

```css
.property-details .x {
  position: sticky;
  width: calc(100% + 44px);
  margin: 0 -22px 16px;
}
```

This rule points to things with class `property-details` things with class `x`. It uses `sticky` positioning so it can be placed very deliberately; sets `width` to `calc(100% + 44px)`; adds outside space of `0 -22px 16px`.

## Block 247 (lines 1588-1593): .property-details-heading

```css
.property-details-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 18px;
}
```

This rule points to things with class `property-details-heading`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `12px` between children; adds outside space of `0 0 18px`.

## Block 248 (lines 1595-1604): .property-details-mark

```css
.property-details-mark {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 14px;
  background: var(--green-600);
  color: #fff;
}
```

This rule points to things with class `property-details-mark`. It turns on **grid**, which lays children out like boxes on graph paper; sets `width` to `44px`; sets `height` to `44px`; sets `flex` to `0 0 44px`; lines up children with `place-items: center`; rounds corners to `14px`; paints the background with `var(--green-600)`; sets the text color to `#fff`.

## Block 249 (lines 1606-1609): .property-details-mark svg

```css
.property-details-mark svg {
  width: 24px;
  height: 24px;
}
```

This rule points to things with class `property-details-mark` svg. It sets `width` to `24px`; sets `height` to `24px`.

## Block 250 (lines 1611-1616): .property-details-heading h2

```css
.property-details-heading h2 {
  margin: 0;
  color: var(--ink);
  font-size: 20px;
  line-height: 1.2;
}
```

This rule points to things with class `property-details-heading` h2. It adds outside space of `0`; sets the text color to `var(--ink)`; shapes the text with `font-size: 20px`; shapes the text with `line-height: 1.2`.

## Block 251 (lines 1618-1622): .property-details-heading p

```css
.property-details-heading p {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 13px;
}
```

This rule points to things with class `property-details-heading` p. It adds outside space of `3px 0 0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`.

## Block 252 (lines 1624-1632): .property-summary

```css
.property-summary {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 18px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
}
```

This rule points to things with class `property-summary`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `minmax(0, 1.1fr) minmax(0, 1fr)`; leaves `18px` between children; adds inside breathing room of `12px`; draws a border of `1px solid var(--line)`; rounds corners to `16px`; paints the background with `var(--card)`.

## Block 253 (lines 1634-1641): .property-summary-image

```css
.property-summary-image {
  position: relative;
  min-width: 0;
  min-height: 190px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--green-50);
}
```

This rule points to things with class `property-summary-image`. It uses `relative` positioning so it can be placed very deliberately; sets `min-width` to `0`; sets `min-height` to `190px`; controls spillover with `hidden`; rounds corners to `12px`; paints the background with `var(--green-50)`.

## Block 254 (lines 1643-1651): .property-summary-image > img, .property-summary-image > svg, .property-summa...

```css
.property-summary-image > img,
.property-summary-image > svg,
.property-summary-image > .commercial-placeholder {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 190px;
  object-fit: cover;
}
```

This rule points to things with class `property-summary-image`  directly inside  img and  things with class `property-summary-image`  directly inside  svg and  things with class `property-summary-image`  directly inside  things with class `commercial-placeholder`. It sets `display` to `block`; sets `width` to `100%`; sets `height` to `100%`; sets `min-height` to `190px`; tells pictures how to fill their box using `cover`.

## Block 255 (lines 1653-1656): .property-summary-image > .commercial-placeholder

```css
.property-summary-image > .commercial-placeholder {
  display: grid;
  place-items: center;
}
```

This rule points to things with class `property-summary-image`  directly inside  things with class `commercial-placeholder`. It turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`.

## Block 256 (lines 1658-1668): .property-photo-count

```css
.property-photo-count {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 5px 9px;
  border-radius: 999px;
  background: #171614cc;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
```

This rule points to things with class `property-photo-count`. It uses `absolute` positioning so it can be placed very deliberately; positions it using `right: 8px`; positions it using `bottom: 8px`; adds inside breathing room of `5px 9px`; rounds corners to `999px`; paints the background with `#171614cc`; sets the text color to `#fff`; shapes the text with `font-size: 11px`. It also adds a few more tidy-up settings.

## Block 257 (lines 1670-1673): .property-summary-copy

```css
.property-summary-copy {
  min-width: 0;
  align-self: center;
}
```

This rule points to things with class `property-summary-copy`. It sets `min-width` to `0`; sets `align-self` to `center`.

## Block 258 (lines 1675-1681): .property-kind

```css
.property-kind {
  display: inline-block;
  margin-bottom: 5px;
  color: var(--green-700);
  font-size: 12px;
  font-weight: 800;
}
```

This rule points to things with class `property-kind`. It sets `display` to `inline-block`; sets `margin-bottom` to `5px`; sets the text color to `var(--green-700)`; shapes the text with `font-size: 12px`; shapes the text with `font-weight: 800`.

## Block 259 (lines 1683-1685): .property-summary-copy .sn

```css
.property-summary-copy .sn {
  font-size: 18px;
}
```

This rule points to things with class `property-summary-copy` things with class `sn`. It shapes the text with `font-size: 18px`.

## Block 260 (lines 1687-1694): .property-summary-location

```css
.property-summary-location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 13px;
}
```

This rule points to things with class `property-summary-location`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `5px` between children; adds outside space of `0 0 8px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`.

## Block 261 (lines 1696-1701): .property-summary-location svg, .property-quick-facts svg

```css
.property-summary-location svg,
.property-quick-facts svg {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
}
```

This rule points to things with class `property-summary-location` svg and  things with class `property-quick-facts` svg. It sets `width` to `15px`; sets `height` to `15px`; sets `flex` to `0 0 auto`.

## Block 262 (lines 1703-1708): .property-summary-rent

```css
.property-summary-rent {
  margin: 8px 0 3px;
  color: var(--green-800);
  font-size: 20px;
  font-weight: 900;
}
```

This rule points to things with class `property-summary-rent`. It adds outside space of `8px 0 3px`; sets the text color to `var(--green-800)`; shapes the text with `font-size: 20px`; shapes the text with `font-weight: 900`.

## Block 263 (lines 1710-1714): .property-summary-rent span

```css
.property-summary-rent span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}
```

This rule points to things with class `property-summary-rent` span. It sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`; shapes the text with `font-weight: 600`.

## Block 264 (lines 1716-1726): .property-move-in

```css
.property-move-in {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin: 8px 0;
  padding: 8px 10px;
  border-radius: 9px;
  background: var(--tint);
  color: var(--muted);
  font-size: 11px;
}
```

This rule points to things with class `property-move-in`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; leaves `10px` between children; adds outside space of `8px 0`; adds inside breathing room of `8px 10px`; rounds corners to `9px`; paints the background with `var(--tint)`; sets the text color to `var(--muted)`. It also adds a few more tidy-up settings.

## Block 265 (lines 1728-1731): .property-move-in b

```css
.property-move-in b {
  color: var(--ink);
  white-space: nowrap;
}
```

This rule points to things with class `property-move-in` b. It sets the text color to `var(--ink)`; sets `white-space` to `nowrap`.

## Block 266 (lines 1733-1739): .property-quick-facts

```css
.property-quick-facts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-top: 10px;
}
```

This rule points to things with class `property-quick-facts`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; lines up children with `align-items: center`; leaves `8px 12px` between children; sets `margin-top` to `10px`.

## Block 267 (lines 1741-1748): .property-quick-facts > span

```css
.property-quick-facts > span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}
```

This rule points to things with class `property-quick-facts`  directly inside  span. It sets `display` to `inline-flex`; lines up children with `align-items: center`; leaves `4px` between children; sets the text color to `var(--muted)`; shapes the text with `font-size: 11px`; shapes the text with `font-weight: 700`.

## Block 268 (lines 1750-1753): .property-quick-facts > .property-availability, .property-verified

```css
.property-quick-facts > .property-availability,
.property-verified {
  color: var(--green-700);
}
```

This rule points to things with class `property-quick-facts`  directly inside  things with class `property-availability` and  things with class `property-verified`. It sets the text color to `var(--green-700)`.

## Block 269 (lines 1755-1762): .property-tabs

```css
.property-tabs {
  display: flex;
  gap: 20px;
  margin-top: 14px;
  overflow-x: auto;
  border-bottom: 1px solid var(--line);
  scrollbar-width: thin;
}
```

This rule points to things with class `property-tabs`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `20px` between children; sets `margin-top` to `14px`; sets `overflow-x` to `auto`; sets `border-bottom` to `1px solid var(--line)`; sets `scrollbar-width` to `thin`.

## Block 270 (lines 1764-1776): .property-tab

```css
.property-tab {
  min-height: 44px;
  flex: 0 0 auto;
  padding: 0 4px;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
```

This rule points to things with class `property-tab`. It sets `min-height` to `44px`; sets `flex` to `0 0 auto`; adds inside breathing room of `0 4px`; draws a border of `0`; sets `border-bottom` to `3px solid transparent`; paints the background with `transparent`; sets the text color to `var(--muted)`; shapes the text with `font: inherit`. It also adds a few more tidy-up settings.

## Block 271 (lines 1778-1781): .property-tab.is-active

```css
.property-tab.is-active {
  border-bottom-color: var(--green-600);
  color: var(--green-800);
}
```

This rule points to things with class `property-tab`things with class `is-active`. It sets `border-bottom-color` to `var(--green-600)`; sets the text color to `var(--green-800)`.

## Block 272 (lines 1783-1786): .property-panel

```css
.property-panel {
  min-height: 145px;
  padding: 12px 2px;
}
```

This rule points to things with class `property-panel`. It sets `min-height` to `145px`; adds inside breathing room of `12px 2px`.

## Block 273 (lines 1788-1790): .property-panel[hidden]

```css
.property-panel[hidden] {
  display: none;
}
```

This rule points to things with class `property-panel` things marked `hidden`. It hides it.

## Block 274 (lines 1792-1794): .property-panel h4

```css
.property-panel h4 {
  margin-top: 8px;
}
```

This rule points to things with class `property-panel` h4. It sets `margin-top` to `8px`.

## Block 275 (lines 1796-1802): .property-description

```css
.property-description {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.65;
  white-space: pre-line;
}
```

This rule points to things with class `property-description`. It adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`; shapes the text with `line-height: 1.65`; sets `white-space` to `pre-line`.

## Block 276 (lines 1804-1808): .property-feature-grid

```css
.property-feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
```

This rule points to things with class `property-feature-grid`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(2, minmax(0, 1fr))`; leaves `10px` between children.

## Block 277 (lines 1810-1818): .property-feature-grid > div

```css
.property-feature-grid > div {
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 2px 8px;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
}
```

This rule points to things with class `property-feature-grid`  directly inside  div. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `24px 1fr`; lines up children with `align-items: center`; leaves `2px 8px` between children; adds inside breathing room of `10px`; draws a border of `1px solid var(--line)`; rounds corners to `10px`.

## Block 278 (lines 1820-1823): .property-feature-grid > div > span

```css
.property-feature-grid > div > span {
  grid-row: span 2;
  color: var(--green-700);
}
```

This rule points to things with class `property-feature-grid`  directly inside  div  directly inside  span. It sets `grid-row` to `span 2`; sets the text color to `var(--green-700)`.

## Block 279 (lines 1825-1828): .property-feature-grid svg

```css
.property-feature-grid svg {
  width: 18px;
  height: 18px;
}
```

This rule points to things with class `property-feature-grid` svg. It sets `width` to `18px`; sets `height` to `18px`.

## Block 280 (lines 1830-1832): .property-feature-grid b

```css
.property-feature-grid b {
  font-size: 12px;
}
```

This rule points to things with class `property-feature-grid` b. It shapes the text with `font-size: 12px`.

## Block 281 (lines 1834-1837): .property-feature-grid small

```css
.property-feature-grid small {
  color: var(--muted);
  font-size: 11px;
}
```

This rule points to things with class `property-feature-grid` small. It sets the text color to `var(--muted)`; shapes the text with `font-size: 11px`.

## Block 282 (lines 1839-1848): .property-contact

```css
.property-contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 6px;
  padding: 12px;
  border-radius: 12px;
  background: var(--green-50);
}
```

This rule points to things with class `property-contact`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; lines up children with `justify-content: space-between`; leaves `14px` between children; sets `margin-top` to `6px`; adds inside breathing room of `12px`; rounds corners to `12px`; paints the background with `var(--green-50)`.

## Block 283 (lines 1850-1853): .property-contact > div:first-child

```css
.property-contact > div:first-child {
  display: grid;
  gap: 3px;
}
```

This rule points to things with class `property-contact`  directly inside  div when it is the first child. It turns on **grid**, which lays children out like boxes on graph paper; leaves `3px` between children.

## Block 284 (lines 1855-1857): .property-contact > div:first-child b

```css
.property-contact > div:first-child b {
  font-size: 13px;
}
```

This rule points to things with class `property-contact`  directly inside  div when it is the first child b. It shapes the text with `font-size: 13px`.

## Block 285 (lines 1859-1862): .property-contact > div:first-child span

```css
.property-contact > div:first-child span {
  color: var(--muted);
  font-size: 11px;
}
```

This rule points to things with class `property-contact`  directly inside  div when it is the first child span. It sets the text color to `var(--muted)`; shapes the text with `font-size: 11px`.

## Block 286 (lines 1864-1868): .property-contact-actions

```css
.property-contact-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

This rule points to things with class `property-contact-actions`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `8px` between children.

## Block 287 (lines 1870-1874): .property-contact-actions .wa

```css
.property-contact-actions .wa {
  min-height: 42px;
  align-items: center;
  padding: 0 14px;
}
```

This rule points to things with class `property-contact-actions` things with class `wa`. It sets `min-height` to `42px`; lines up children with `align-items: center`; adds inside breathing room of `0 14px`.

## Block 288 (lines 1876-1880): .property-report

```css
.property-report {
  margin-top: 12px;
  color: var(--muted);
  font-size: 12px;
}
```

This rule points to things with class `property-report`. It sets `margin-top` to `12px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`.

## Block 289 (lines 1882-1886): .property-report summary

```css
.property-report summary {
  min-height: 40px;
  padding-top: 12px;
  cursor: pointer;
}
```

This rule points to things with class `property-report` summary. It sets `min-height` to `40px`; sets `padding-top` to `12px`; changes the mouse pointer to `pointer`.

## Block 290 (lines 1888-1898): @media (min-width: 640px)

```css
@media (min-width: 640px) {
  .sheet {
    align-items: center;
  }
  .sp {
    border-radius: 22px;
  }
  .property-details {
    border-radius: 22px;
  }
}
```

This block only runs when `(min-width: 640px)` is true. Inside it, the file changes `.sheet`, `.sp`, `.property-details`.

## Block 291 (lines 1899-1907): .lf

```css
.lf {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: var(--bg);
  overflow: auto;
  display: none;
  color: var(--ink);
}
```

This rule points to things with class `lf`. It uses `fixed` positioning so it can be placed very deliberately; positions it using `inset: 0`; gives it layer number `30`, like deciding which paper sits on top; paints the background with `var(--bg)`; controls spillover with `auto`; hides it; sets the text color to `var(--ink)`.

## Block 292 (lines 1908-1911): .lf.on

```css
.lf.on {
  display: block;
  animation: listing-panel-enter 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

This rule points to things with class `lf`things with class `on`. It sets `display` to `block`; starts an animation called `listing-panel-enter 260ms cubic-bezier(0.22, 1, 0.36, 1) both`.

## Block 293 (lines 1912-1916): .lw

```css
.lw {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 16px;
}
```

This rule points to things with class `lw`. It sets `max-width` to `640px`; adds outside space of `0 auto`; adds inside breathing room of `0 16px`.

## Block 294 (lines 1917-1920): .lbody

```css
.lbody {
  padding-top: 18px;
  padding-bottom: 120px;
}
```

This rule points to things with class `lbody`. It sets `padding-top` to `18px`; sets `padding-bottom` to `120px`.

## Block 295 (lines 1921-1923): .listing-step-content

```css
.listing-step-content {
  animation: listing-step-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

This rule points to things with class `listing-step-content`. It starts an animation called `listing-step-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) both`.

## Block 296 (lines 1924-1931): .lh

```css
.lh {
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--card);
  border-bottom: 1px solid var(--line);
  padding: calc(10px + env(safe-area-inset-top, 0px)) 0 8px;
}
```

This rule points to things with class `lh`. It uses `sticky` positioning so it can be placed very deliberately; positions it using `top: 0`; gives it layer number `5`, like deciding which paper sits on top; paints the background with `var(--card)`; sets `border-bottom` to `1px solid var(--line)`; adds inside breathing room of `calc(10px + env(safe-area-inset-top, 0px)) 0 8px`.

## Block 297 (lines 1932-1936): .lt

```css
.lt {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

This rule points to things with class `lt`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; lines up children with `align-items: center`.

## Block 298 (lines 1937-1940): .lt b

```css
.lt b {
  font-size: 17px;
  font-weight: 800;
}
```

This rule points to things with class `lt` b. It shapes the text with `font-size: 17px`; shapes the text with `font-weight: 800`.

## Block 299 (lines 1941-1945): .pt

```css
.pt {
  font-size: 12.5px;
  color: var(--muted);
  margin: 6px 0;
}
```

This rule points to things with class `pt`. It shapes the text with `font-size: 12.5px`; sets the text color to `var(--muted)`; adds outside space of `6px 0`.

## Block 300 (lines 1946-1948): .pt b

```css
.pt b {
  color: var(--ink);
}
```

This rule points to things with class `pt` b. It sets the text color to `var(--ink)`.

## Block 301 (lines 1949-1953): .seg

```css
.seg {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
}
```

This rule points to things with class `seg`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(10, 1fr)`; leaves `4px` between children.

## Block 302 (lines 1954-1958): .seg i

```css
.seg i {
  height: 5px;
  border-radius: 3px;
  background: var(--line);
}
```

This rule points to things with class `seg` i. It sets `height` to `5px`; rounds corners to `3px`; paints the background with `var(--line)`.

## Block 303 (lines 1959-1962): .seg i.d, .seg i.c

```css
.seg i.d,
.seg i.c {
  background: var(--brand);
}
```

This rule points to things with class `seg` ithings with class `d` and  things with class `seg` ithings with class `c`. It paints the background with `var(--brand)`.

## Block 304 (lines 1963-1965): .seg i.c

```css
.seg i.c {
  background: var(--gold);
}
```

This rule points to things with class `seg` ithings with class `c`. It paints the background with `var(--gold)`.

## Block 305 (lines 1966-1973): .pn

```css
.pn {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding: 8px 0 2px;
  scrollbar-width: none;
}
```

This rule points to things with class `pn`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `6px` between children; sets `overflow-x` to `auto`; adds inside breathing room of `8px 0 2px`; sets `scrollbar-width` to `none`.

## Block 306 (lines 1974-1983): .pn button

```css
.pn button {
  flex: none;
  border: 0;
  background: none;
  font: 800 12px inherit;
  color: var(--muted);
  padding: 5px 8px;
  border-radius: 999px;
  cursor: pointer;
}
```

This rule points to things with class `pn` button. It sets `flex` to `none`; draws a border of `0`; paints the background with `none`; shapes the text with `font: 800 12px inherit`; sets the text color to `var(--muted)`; adds inside breathing room of `5px 8px`; rounds corners to `999px`; changes the mouse pointer to `pointer`.

## Block 307 (lines 1984-1987): .pn button.c

```css
.pn button.c {
  background: var(--brand);
  color: var(--btn-ink);
}
```

This rule points to things with class `pn` buttonthings with class `c`. It paints the background with `var(--brand)`; sets the text color to `var(--btn-ink)`.

## Block 308 (lines 1988-1990): .pn button.d

```css
.pn button.d {
  color: var(--brand);
}
```

This rule points to things with class `pn` buttonthings with class `d`. It sets the text color to `var(--brand)`.

## Block 309 (lines 1991-1994): .pn button:disabled

```css
.pn button:disabled {
  opacity: 0.45;
  cursor: default;
}
```

This rule points to things with class `pn` button:disabled. It makes it `0.45` see-through; changes the mouse pointer to `default`.

## Block 310 (lines 1995-1998): .pn span

```css
.pn span {
  color: var(--muted);
  font-size: 11px;
}
```

This rule points to things with class `pn` span. It sets the text color to `var(--muted)`; shapes the text with `font-size: 11px`.

## Block 311 (lines 1999-2004): .lbody h2

```css
.lbody h2 {
  margin: 0 0 4px;
  font-size: 22px;
  letter-spacing: -0.5px;
  font-weight: 800;
}
```

This rule points to things with class `lbody` h2. It adds outside space of `0 0 4px`; shapes the text with `font-size: 22px`; shapes the text with `letter-spacing: -0.5px`; shapes the text with `font-weight: 800`.

## Block 312 (lines 2005-2009): .lbody h3

```css
.lbody h3 {
  margin: 22px 0 8px;
  font-size: 16px;
  font-weight: 800;
}
```

This rule points to things with class `lbody` h3. It adds outside space of `22px 0 8px`; shapes the text with `font-size: 16px`; shapes the text with `font-weight: 800`.

## Block 313 (lines 2010-2014): .sub2

```css
.sub2 {
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 13px;
}
```

This rule points to things with class `sub2`. It adds outside space of `0 0 16px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`.

## Block 314 (lines 2015-2017): .fld

```css
.fld {
  margin: 0 0 16px;
}
```

This rule points to things with class `fld`. It adds outside space of `0 0 16px`.

## Block 315 (lines 2018-2023): .fld > label

```css
.fld > label {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
  margin-bottom: 6px;
}
```

This rule points to things with class `fld`  directly inside  label. It sets `display` to `block`; shapes the text with `font-size: 13.5px`; shapes the text with `font-weight: 800`; sets `margin-bottom` to `6px`.

## Block 316 (lines 2024-2030): .fld small

```css
.fld small {
  display: block;
  color: var(--muted);
  font-size: 12px;
  margin-top: 5px;
  font-weight: 600;
}
```

This rule points to things with class `fld` small. It sets `display` to `block`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`; sets `margin-top` to `5px`; shapes the text with `font-weight: 600`.

## Block 317 (lines 2031-2034): .fld small .ok

```css
.fld small .ok {
  color: var(--ok);
  font-weight: 800;
}
```

This rule points to things with class `fld` small things with class `ok`. It sets the text color to `var(--ok)`; shapes the text with `font-weight: 800`.

## Block 318 (lines 2035-2051): .lf input[type="text"], .lf input[type="number"], .lf input[type="url"], .lf ...

```css
.lf input[type="text"],
.lf input[type="number"],
.lf input[type="url"],
.lf input[type="tel"],
.lf input[type="date"],
.lf input[type="time"],
.lf select,
.lf textarea {
  width: 100%;
  min-height: 48px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: var(--card);
  padding: 10px 12px;
  font-weight: 700;
  font-size: 16px;
}
```

This rule points to things with class `lf` input whose type is "text"  and  things with class `lf` input whose type is "number"  and  things with class `lf` input whose type is "url"  and  things with class `lf` input whose type is "tel"  and  things with class `lf` input whose type is "date"  and  things with class `lf` input whose type is "time"  and  things with class `lf` select and  things with class `lf` textarea. It sets `width` to `100%`; sets `min-height` to `48px`; rounds corners to `12px`; draws a border of `1.5px solid var(--line)`; paints the background with `var(--card)`; adds inside breathing room of `10px 12px`; shapes the text with `font-weight: 700`; shapes the text with `font-size: 16px`.

## Block 319 (lines 2052-2055): .lf textarea

```css
.lf textarea {
  resize: vertical;
  line-height: 1.4;
}
```

This rule points to things with class `lf` textarea. It sets `resize` to `vertical`; shapes the text with `line-height: 1.4`.

## Block 320 (lines 2056-2063): .er

```css
.er {
  display: block;
  color: #d64545;
  font-size: 12.5px;
  font-weight: 800;
  font-style: normal;
  margin-top: 5px;
}
```

This rule points to things with class `er`. It sets `display` to `block`; sets the text color to `#d64545`; shapes the text with `font-size: 12.5px`; shapes the text with `font-weight: 800`; sets `font-style` to `normal`; sets `margin-top` to `5px`.

## Block 321 (lines 2064-2066): .er:empty

```css
.er:empty {
  display: none;
}
```

This rule points to things with class `er`:empty. It hides it.

## Block 322 (lines 2067-2071): .bad input, .bad select, .bad textarea

```css
.bad input,
.bad select,
.bad textarea {
  border-color: #d64545 !important;
}
```

This rule points to things with class `bad` input and  things with class `bad` select and  things with class `bad` textarea. It sets `border-color` to `#d64545 !important`.

## Block 323 (lines 2072-2077): .bad.ps, .mx.bad

```css
.bad.ps,
.mx.bad {
  outline: 2px solid #d6454566;
  outline-offset: 2px;
  border-radius: 12px;
}
```

This rule points to things with class `bad`things with class `ps` and  things with class `mx`things with class `bad`. It sets `outline` to `2px solid #d6454566`; sets `outline-offset` to `2px`; rounds corners to `12px`.

## Block 324 (lines 2078-2083): .sum

```css
.sum {
  color: #d64545;
  font-weight: 800;
  font-size: 13px;
  margin-bottom: 12px;
}
```

This rule points to things with class `sum`. It sets the text color to `#d64545`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 13px`; sets `margin-bottom` to `12px`.

## Block 325 (lines 2084-2086): .sum:empty

```css
.sum:empty {
  display: none;
}
```

This rule points to things with class `sum`:empty. It hides it.

## Block 326 (lines 2087-2091): .rg

```css
.rg {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

This rule points to things with class `rg`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; leaves `8px` between children.

## Block 327 (lines 2092-2095): .ch

```css
.ch {
  position: relative;
  display: inline-block;
}
```

This rule points to things with class `ch`. It uses `relative` positioning so it can be placed very deliberately; sets `display` to `inline-block`.

## Block 328 (lines 2096-2104): .ch input

```css
.ch input {
  position: absolute;
  opacity: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
}
```

This rule points to things with class `ch` input. It uses `absolute` positioning so it can be placed very deliberately; makes it `0` see-through; positions it using `inset: 0`; sets `width` to `100%`; sets `height` to `100%`; adds outside space of `0`; changes the mouse pointer to `pointer`.

## Block 329 (lines 2105-2113): .ch span

```css
.ch span {
  display: block;
  padding: 12px 14px;
  border: 1.5px solid var(--line);
  border-radius: 12px;
  background: var(--card);
  font-weight: 800;
  font-size: 13.5px;
}
```

This rule points to things with class `ch` span. It sets `display` to `block`; adds inside breathing room of `12px 14px`; draws a border of `1.5px solid var(--line)`; rounds corners to `12px`; paints the background with `var(--card)`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 13.5px`.

## Block 330 (lines 2114-2118): .ch input:checked + span

```css
.ch input:checked + span {
  background: var(--brand);
  border-color: var(--brand);
  color: var(--btn-ink);
}
```

This rule points to things with class `ch` input:checked + span. It paints the background with `var(--brand)`; sets `border-color` to `var(--brand)`; sets the text color to `var(--btn-ink)`.

## Block 331 (lines 2119-2121): .ch input:focus-visible + span

```css
.ch input:focus-visible + span {
  outline: 3px solid var(--gold);
}
```

This rule points to things with class `ch` input when keyboard focus is visible + span. It sets `outline` to `3px solid var(--gold)`.

## Block 332 (lines 2122-2125): .ch.line

```css
.ch.line {
  display: block;
  margin: 10px 0;
}
```

This rule points to things with class `ch`things with class `line`. It sets `display` to `block`; adds outside space of `10px 0`.

## Block 333 (lines 2126-2134): .mx

```css
.mx {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
}
```

This rule points to things with class `mx`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; lines up children with `align-items: center`; lines up children with `justify-content: space-between`; leaves `6px 10px` between children; adds inside breathing room of `9px 0`; sets `border-bottom` to `1px solid var(--line)`.

## Block 334 (lines 2135-2138): .mx > span

```css
.mx > span {
  font-weight: 800;
  font-size: 14px;
}
```

This rule points to things with class `mx`  directly inside  span. It shapes the text with `font-weight: 800`; shapes the text with `font-size: 14px`.

## Block 335 (lines 2139-2143): .mx select, .mx input

```css
.mx select,
.mx input {
  width: 52% !important;
  min-height: 44px !important;
}
```

This rule points to things with class `mx` select and  things with class `mx` input. It sets `width` to `52% !important`; sets `min-height` to `44px !important`.

## Block 336 (lines 2144-2147): .mx .er

```css
.mx .er {
  width: 100%;
  margin: 0;
}
```

This rule points to things with class `mx` things with class `er`. It sets `width` to `100%`; adds outside space of `0`.

## Block 337 (lines 2148-2163): .btn2

```css
.btn2 {
  border: 1.5px solid var(--line);
  background: var(--card);
  color: var(--ink);
  border-radius: 12px;
  padding: 0 14px;
  height: 42px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
}
```

This rule points to things with class `btn2`. It draws a border of `1.5px solid var(--line)`; paints the background with `var(--card)`; sets the text color to `var(--ink)`; rounds corners to `12px`; adds inside breathing room of `0 14px`; sets `height` to `42px`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 13px`. It also adds a few more tidy-up settings.

## Block 338 (lines 2164-2170): .btn2.big, .btn.big

```css
.btn2.big,
.btn.big {
  height: 52px;
  font-size: 15px;
  border-radius: 14px;
  flex: 1;
}
```

This rule points to things with class `btn2`things with class `big` and  things with class `btn`things with class `big`. It sets `height` to `52px`; shapes the text with `font-size: 15px`; rounds corners to `14px`; sets `flex` to `1`.

## Block 339 (lines 2171-2173): .up:focus-within

```css
.up:focus-within {
  outline: 3px solid var(--gold);
}
```

This rule points to things with class `up`:focus-within. It sets `outline` to `3px solid var(--gold)`.

## Block 340 (lines 2174-2179): .up input

```css
.up input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}
```

This rule points to things with class `up` input. It uses `absolute` positioning so it can be placed very deliberately; makes it `0` see-through; sets `width` to `1px`; sets `height` to `1px`.

## Block 341 (lines 2180-2185): .or

```css
.or {
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
  margin: 10px 0 6px;
}
```

This rule points to things with class `or`. It shapes the text with `font-size: 12px`; sets the text color to `var(--muted)`; shapes the text with `font-weight: 700`; adds outside space of `10px 0 6px`.

## Block 342 (lines 2186-2193): .tot2 > div

```css
.tot2 > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13.5px;
}
```

This rule points to things with class `tot2`  directly inside  div. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; leaves `12px` between children; adds inside breathing room of `8px 0`; sets `border-bottom` to `1px solid var(--line)`; shapes the text with `font-size: 13.5px`.

## Block 343 (lines 2194-2196): .tot2 span

```css
.tot2 span {
  color: var(--muted);
}
```

This rule points to things with class `tot2` span. It sets the text color to `var(--muted)`.

## Block 344 (lines 2197-2199): .tot2 b

```css
.tot2 b {
  text-align: right;
}
```

This rule points to things with class `tot2` b. It sets `text-align` to `right`.

## Block 345 (lines 2200-2207): .tot2 .g

```css
.tot2 .g {
  background: var(--tint);
  border: 0;
  border-radius: 12px;
  padding: 14px;
  margin-top: 10px;
  font-size: 15px;
}
```

This rule points to things with class `tot2` things with class `g`. It paints the background with `var(--tint)`; draws a border of `0`; rounds corners to `12px`; adds inside breathing room of `14px`; sets `margin-top` to `10px`; shapes the text with `font-size: 15px`.

## Block 346 (lines 2208-2210): .tot2 .g b

```css
.tot2 .g b {
  font-size: 20px;
}
```

This rule points to things with class `tot2` things with class `g` b. It shapes the text with `font-size: 20px`.

## Block 347 (lines 2211-2214): .tot2 .g span

```css
.tot2 .g span {
  color: var(--ink);
  font-weight: 800;
}
```

This rule points to things with class `tot2` things with class `g` span. It sets the text color to `var(--ink)`; shapes the text with `font-weight: 800`.

## Block 348 (lines 2215-2219): .pg

```css
.pg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
```

This rule points to things with class `pg`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `1fr 1fr`; leaves `10px` between children.

## Block 349 (lines 2220-2225): .ps

```css
.ps {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px;
}
```

This rule points to things with class `ps`. It paints the background with `var(--card)`; draws a border of `1px solid var(--line)`; rounds corners to `14px`; adds inside breathing room of `10px`.

## Block 350 (lines 2226-2228): .ps > b

```css
.ps > b {
  font-size: 13px;
}
```

This rule points to things with class `ps`  directly inside  b. It shapes the text with `font-size: 13px`.

## Block 351 (lines 2229-2239): .pv

```css
.pv {
  height: 110px;
  border-radius: 10px;
  background: var(--bg);
  margin: 8px 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: var(--muted);
  font-size: 12px;
}
```

This rule points to things with class `pv`. It sets `height` to `110px`; rounds corners to `10px`; paints the background with `var(--bg)`; adds outside space of `8px 0`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; controls spillover with `hidden`; sets the text color to `var(--muted)`. It also adds a few more tidy-up settings.

## Block 352 (lines 2240-2244): .pv img

```css
.pv img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

This rule points to things with class `pv` img. It sets `width` to `100%`; sets `height` to `100%`; tells pictures how to fill their box using `cover`.

## Block 353 (lines 2245-2249): .pa

```css
.pa {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
```

This rule points to things with class `pa`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `6px` between children; sets `flex-wrap` to `wrap`.

## Block 354 (lines 2250-2254): .pa .btn2

```css
.pa .btn2 {
  height: 38px;
  padding: 0 10px;
  font-size: 12px;
}
```

This rule points to things with class `pa` things with class `btn2`. It sets `height` to `38px`; adds inside breathing room of `0 10px`; shapes the text with `font-size: 12px`.

## Block 355 (lines 2255-2265): .xr

```css
.xr {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 8px 10px;
  align-items: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 8px;
  margin-bottom: 8px;
}
```

This rule points to things with class `xr`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `64px 1fr`; leaves `8px 10px` between children; lines up children with `align-items: center`; paints the background with `var(--card)`; draws a border of `1px solid var(--line)`; rounds corners to `12px`; adds inside breathing room of `8px`. It also adds a few more tidy-up settings.

## Block 356 (lines 2266-2271): .xr img

```css
.xr img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}
```

This rule points to things with class `xr` img. It sets `width` to `64px`; sets `height` to `64px`; tells pictures how to fill their box using `cover`; rounds corners to `8px`.

## Block 357 (lines 2272-2276): .xr div

```css
.xr div {
  grid-column: 1/-1;
  display: flex;
  gap: 6px;
}
```

This rule points to things with class `xr` div. It sets `grid-column` to `1/-1`; turns on **flexbox**, which lines children up like toys in a row or column; leaves `6px` between children.

## Block 358 (lines 2277-2279): .xr select

```css
.xr select {
  min-height: 40px !important;
}
```

This rule points to things with class `xr` select. It sets `min-height` to `40px !important`.

## Block 359 (lines 2280-2292): .av

```css
.av {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px dashed var(--line);
  overflow: hidden;
  display: grid;
  place-items: center;
  font-size: 12px;
  color: var(--muted);
  margin: 8px 0;
}
```

This rule points to things with class `av`. It sets `width` to `96px`; sets `height` to `96px`; rounds corners to `50%`; paints the background with `var(--bg)`; draws a border of `2px dashed var(--line)`; controls spillover with `hidden`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`. It also adds a few more tidy-up settings.

## Block 360 (lines 2293-2297): .av img

```css
.av img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

This rule points to things with class `av` img. It sets `width` to `100%`; sets `height` to `100%`; tells pictures how to fill their box using `cover`.

## Block 361 (lines 2298-2303): .vs

```css
.vs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 8px 0;
}
```

This rule points to things with class `vs`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `6px` between children; sets `flex-wrap` to `wrap`; adds outside space of `8px 0`.

## Block 362 (lines 2304-2312): .vs span

```css
.vs span {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}
```

This rule points to things with class `vs` span. It paints the background with `var(--bg)`; draws a border of `1px solid var(--line)`; rounds corners to `8px`; adds inside breathing room of `4px 9px`; shapes the text with `font-size: 12px`; shapes the text with `font-weight: 700`; sets the text color to `var(--muted)`.

## Block 363 (lines 2313-2319): .rv

```css
.rv {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 12px;
}
```

This rule points to things with class `rv`. It paints the background with `var(--card)`; draws a border of `1px solid var(--line)`; rounds corners to `16px`; adds inside breathing room of `12px 14px`; sets `margin-bottom` to `12px`.

## Block 364 (lines 2320-2325): .rh

```css
.rh {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
```

This rule points to things with class `rh`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; lines up children with `align-items: center`; sets `margin-bottom` to `4px`.

## Block 365 (lines 2326-2328): .rh b

```css
.rh b {
  font-size: 15px;
}
```

This rule points to things with class `rh` b. It shapes the text with `font-size: 15px`.

## Block 366 (lines 2329-2339): .ed

```css
.ed {
  border: 1.5px solid var(--brand);
  color: var(--brand);
  background: none;
  border-radius: 10px;
  height: 34px;
  padding: 0 14px;
  font-weight: 800;
  font-size: 12.5px;
  cursor: pointer;
}
```

This rule points to things with class `ed`. It draws a border of `1.5px solid var(--brand)`; sets the text color to `var(--brand)`; paints the background with `none`; rounds corners to `10px`; sets `height` to `34px`; adds inside breathing room of `0 14px`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 12.5px`. It also adds a few more tidy-up settings.

## Block 367 (lines 2340-2347): .rv .kv div

```css
.rv .kv div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
```

This rule points to things with class `rv` things with class `kv` div. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; leaves `12px` between children; adds inside breathing room of `7px 0`; sets `border-bottom` to `1px solid var(--line)`; shapes the text with `font-size: 13px`.

## Block 368 (lines 2348-2350): .rv .kv span

```css
.rv .kv span {
  color: var(--muted);
}
```

This rule points to things with class `rv` things with class `kv` span. It sets the text color to `var(--muted)`.

## Block 369 (lines 2351-2353): .rv .kv b

```css
.rv .kv b {
  text-align: right;
}
```

This rule points to things with class `rv` things with class `kv` b. It sets `text-align` to `right`.

## Block 370 (lines 2354-2358): .rvp

```css
.rvp {
  display: flex;
  gap: 6px;
  overflow-x: auto;
}
```

This rule points to things with class `rvp`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `6px` between children; sets `overflow-x` to `auto`.

## Block 371 (lines 2359-2365): .rvp img

```css
.rvp img {
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: 8px;
  flex: none;
}
```

This rule points to things with class `rvp` img. It sets `width` to `76px`; sets `height` to `76px`; tells pictures how to fill their box using `cover`; rounds corners to `8px`; sets `flex` to `none`.

## Block 372 (lines 2366-2374): .warn

```css
.warn {
  background: #e0a52622;
  border: 1.5px solid #e0a526;
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 800;
  font-size: 13px;
  margin: 16px 0;
}
```

This rule points to things with class `warn`. It paints the background with `#e0a52622`; draws a border of `1.5px solid #e0a526`; rounds corners to `14px`; adds inside breathing room of `12px 14px`; shapes the text with `font-weight: 800`; shapes the text with `font-size: 13px`; adds outside space of `16px 0`.

## Block 373 (lines 2375-2378): .fail

```css
.fail {
  background: #d6454522;
  border-color: #d64545;
}
```

This rule points to things with class `fail`. It paints the background with `#d6454522`; sets `border-color` to `#d64545`.

## Block 374 (lines 2379-2384): .pv2

```css
.pv2 {
  font-size: 12px;
  color: var(--muted);
  margin: 12px 0;
  line-height: 1.5;
}
```

This rule points to things with class `pv2`. It shapes the text with `font-size: 12px`; sets the text color to `var(--muted)`; adds outside space of `12px 0`; shapes the text with `line-height: 1.5`.

## Block 375 (lines 2385-2394): .lfoot

```css
.lfoot {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 31;
  background: var(--card);
  border-top: 1px solid var(--line);
  padding: 10px 0 calc(10px + env(safe-area-inset-bottom, 0px));
}
```

This rule points to things with class `lfoot`. It uses `fixed` positioning so it can be placed very deliberately; positions it using `left: 0`; positions it using `right: 0`; positions it using `bottom: 0`; gives it layer number `31`, like deciding which paper sits on top; paints the background with `var(--card)`; sets `border-top` to `1px solid var(--line)`; adds inside breathing room of `10px 0 calc(10px + env(safe-area-inset-bottom, 0px))`.

## Block 376 (lines 2395-2398): .lfoot .lw

```css
.lfoot .lw {
  display: flex;
  gap: 10px;
}
```

This rule points to things with class `lfoot` things with class `lw`. It turns on **flexbox**, which lines children up like toys in a row or column; leaves `10px` between children.

## Block 377 (lines 2399-2402): .lf.fin .lh, .lf.fin .lfoot

```css
.lf.fin .lh,
.lf.fin .lfoot {
  display: none;
}
```

This rule points to things with class `lf`things with class `fin` things with class `lh` and  things with class `lf`things with class `fin` things with class `lfoot`. It hides it.

## Block 378 (lines 2403-2406): .okc

```css
.okc {
  text-align: center;
  padding: 30px 0;
}
```

This rule points to things with class `okc`. It sets `text-align` to `center`; adds inside breathing room of `30px 0`.

## Block 379 (lines 2407-2417): .okc-i

```css
.okc-i {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--g);
  color: var(--gi);
  font-size: 30px;
  display: grid;
  place-items: center;
  margin: 0 auto 12px;
}
```

This rule points to things with class `okc-i`. It sets `width` to `64px`; sets `height` to `64px`; rounds corners to `50%`; paints the background with `var(--g)`; sets the text color to `var(--gi)`; shapes the text with `font-size: 30px`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`. It also adds a few more tidy-up settings.

## Block 380 (lines 2418-2423): .ref

```css
.ref {
  background: var(--tint);
  border-radius: 14px;
  padding: 14px;
  margin: 16px 0;
}
```

This rule points to things with class `ref`. It paints the background with `var(--tint)`; rounds corners to `14px`; adds inside breathing room of `14px`; adds outside space of `16px 0`.

## Block 381 (lines 2424-2429): .ref b

```css
.ref b {
  display: block;
  font-size: 22px;
  letter-spacing: 1px;
  margin-top: 4px;
}
```

This rule points to things with class `ref` b. It sets `display` to `block`; shapes the text with `font-size: 22px`; shapes the text with `letter-spacing: 1px`; sets `margin-top` to `4px`.

## Block 382 (lines 2430-2432): #psheet

```css
#psheet {
  z-index: 40;
}
```

This rule points to the one with id `psheet`. It gives it layer number `40`, like deciding which paper sits on top.

## Block 383 (lines 2433-2437): .rep2

```css
.rep2 {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}
```

This rule points to things with class `rep2`. It turns on **grid**, which lays children out like boxes on graph paper; leaves `8px` between children; sets `margin-top` to `12px`.

## Block 384 (lines 2438-2442): @media (min-width: 640px)

```css
@media (min-width: 640px) {
  .pg {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

This block only runs when `(min-width: 640px)` is true. Inside it, the file changes `.pg`.

## Block 385 (lines 2443-2451): .pol

```css
.pol {
  position: fixed;
  inset: 0;
  z-index: 36;
  background: var(--bg);
  overflow: auto;
  display: none;
  color: var(--ink);
}
```

This rule points to things with class `pol`. It uses `fixed` positioning so it can be placed very deliberately; positions it using `inset: 0`; gives it layer number `36`, like deciding which paper sits on top; paints the background with `var(--bg)`; controls spillover with `auto`; hides it; sets the text color to `var(--ink)`.

## Block 386 (lines 2452-2454): .pol.on

```css
.pol.on {
  display: block;
}
```

This rule points to things with class `pol`things with class `on`. It sets `display` to `block`.

## Block 387 (lines 2455-2462): .ph

```css
.ph {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--card);
  border-bottom: 1px solid var(--line);
  padding: calc(10px + env(safe-area-inset-top, 0px)) 0 10px;
}
```

This rule points to things with class `ph`. It uses `sticky` positioning so it can be placed very deliberately; positions it using `top: 0`; gives it layer number `2`, like deciding which paper sits on top; paints the background with `var(--card)`; sets `border-bottom` to `1px solid var(--line)`; adds inside breathing room of `calc(10px + env(safe-area-inset-top, 0px)) 0 10px`.

## Block 388 (lines 2463-2468): .ph .lw

```css
.ph .lw {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 720px;
}
```

This rule points to things with class `ph` things with class `lw`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `justify-content: space-between`; lines up children with `align-items: center`; sets `max-width` to `720px`.

## Block 389 (lines 2469-2472): .ph b

```css
.ph b {
  font-size: 16px;
  font-weight: 800;
}
```

This rule points to things with class `ph` b. It shapes the text with `font-size: 16px`; shapes the text with `font-weight: 800`.

## Block 390 (lines 2473-2478): .pc

```css
.pc {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 16px 70px;
  line-height: 1.6;
}
```

This rule points to things with class `pc`. It sets `max-width` to `720px`; adds outside space of `0 auto`; adds inside breathing room of `20px 16px 70px`; shapes the text with `line-height: 1.6`.

## Block 391 (lines 2479-2484): .pc h1

```css
.pc h1 {
  font-size: 26px;
  letter-spacing: -0.6px;
  margin: 0 0 10px;
  font-weight: 800;
}
```

This rule points to things with class `pc` h1. It shapes the text with `font-size: 26px`; shapes the text with `letter-spacing: -0.6px`; adds outside space of `0 0 10px`; shapes the text with `font-weight: 800`.

## Block 392 (lines 2485-2489): .pc h2

```css
.pc h2 {
  font-size: 18px;
  margin: 28px 0 8px;
  font-weight: 800;
}
```

This rule points to things with class `pc` h2. It shapes the text with `font-size: 18px`; adds outside space of `28px 0 8px`; shapes the text with `font-weight: 800`.

## Block 393 (lines 2490-2494): .pc h3

```css
.pc h3 {
  font-size: 15px;
  margin: 18px 0 6px;
  font-weight: 800;
}
```

This rule points to things with class `pc` h3. It shapes the text with `font-size: 15px`; adds outside space of `18px 0 6px`; shapes the text with `font-weight: 800`.

## Block 394 (lines 2495-2498): .pc p

```css
.pc p {
  margin: 0 0 12px;
  font-size: 14px;
}
```

This rule points to things with class `pc` p. It adds outside space of `0 0 12px`; shapes the text with `font-size: 14px`.

## Block 395 (lines 2499-2503): .pc ul

```css
.pc ul {
  margin: 0 0 12px;
  padding-left: 20px;
  font-size: 14px;
}
```

This rule points to things with class `pc` ul. It adds outside space of `0 0 12px`; sets `padding-left` to `20px`; shapes the text with `font-size: 14px`.

## Block 396 (lines 2504-2506): .pc li

```css
.pc li {
  margin-bottom: 5px;
}
```

This rule points to things with class `pc` li. It sets `margin-bottom` to `5px`.

## Block 397 (lines 2507-2510): .pc a

```css
.pc a {
  color: var(--gold);
  font-weight: 800;
}
```

This rule points to things with class `pc` a. It sets the text color to `var(--gold)`; shapes the text with `font-weight: 800`.

## Block 398 (lines 2511-2514): .tw

```css
.tw {
  overflow-x: auto;
  margin: 0 0 14px;
}
```

This rule points to things with class `tw`. It sets `overflow-x` to `auto`; adds outside space of `0 0 14px`.

## Block 399 (lines 2515-2520): .pc table

```css
.pc table {
  border-collapse: collapse;
  width: 100%;
  min-width: 480px;
  font-size: 13px;
}
```

This rule points to things with class `pc` table. It sets `border-collapse` to `collapse`; sets `width` to `100%`; sets `min-width` to `480px`; shapes the text with `font-size: 13px`.

## Block 400 (lines 2521-2527): .pc th, .pc td

```css
.pc th,
.pc td {
  border: 1px solid var(--line);
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}
```

This rule points to things with class `pc` th and  things with class `pc` td. It draws a border of `1px solid var(--line)`; adds inside breathing room of `8px 10px`; sets `text-align` to `left`; sets `vertical-align` to `top`.

## Block 401 (lines 2528-2530): .pc th

```css
.pc th {
  background: var(--tint);
}
```

This rule points to things with class `pc` th. It paints the background with `var(--tint)`.

## Block 402 (lines 2531-2541): @media (min-width: 640px)

```css
@media (min-width: 640px) {
  .links-btn {
    display: inline-flex;
  }
  .grid {
    grid-template-columns: 1fr 1fr;
  }
  .trust .w {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

This block only runs when `(min-width: 640px)` is true. Inside it, the file changes `.links-btn`, `.grid`, `.trust .w`.

## Block 403 (lines 2542-2640): @media (min-width: 900px)

```css
@media (min-width: 900px) {
  body.public-site nav .w {
    height: 84px;
  }
  .links {
    display: flex;
  }
  .links.open {
    position: static;
    flex-direction: row;
    gap: 26px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    color: inherit;
  }
  .links.open a {
    padding: 6px 0;
    border: 0;
  }
  .ib.m {
    display: none;
  }
  .hero {
    padding: 150px 0 90px;
    min-height: 560px;
    background:
      linear-gradient(
        90deg,
        var(--bg) 0%,
        var(--bg) 36%,
        color-mix(in srgb, var(--bg) 84%, transparent) 48%,
        transparent 68%
      ),
      var(--img) right 32%/64% auto no-repeat var(--bg);
  }
  .hero h1 {
    font-size: 46px;
    letter-spacing: -1.4px;
  }
  .script {
    font-size: 46px;
  }
  .hero p.d {
    font-size: 14.5px;
  }
  .search {
    margin-top: -46px;
    grid-template-columns: 1fr 1.1fr 1.1fr 1fr 1fr auto;
    align-items: end;
    border-radius: 999px;
    padding: 12px 12px 12px 26px;
    gap: 0;
  }
  .f {
    padding-right: 12px;
    margin-right: 12px;
    border-right: 1px solid var(--line);
  }
  .f:nth-of-type(5) {
    border: 0;
    margin: 0;
  }
  .f select,
  .f input {
    border: 0;
    background: transparent;
    height: 30px;
    padding: 0;
  }
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .pic {
    height: 190px;
  }
  .skeleton-image {
    height: 190px;
  }
  .why {
    grid-template-columns: 1.05fr 1fr;
    gap: 44px;
  }
  .wimg {
    height: 300px;
  }
  .cta {
    padding: 38px 44px;
  }
  .cta h2 {
    font-size: 28px;
  }
  .fg {
    grid-template-columns: 1.3fr 1fr 1.3fr 1fr;
  }
}
```

This block only runs when `(min-width: 900px)` is true. Inside it, the file changes `body.public-site nav .w`, `.links`, `.links.open`, `.links.open a`, `.ib.m`, and more.

## Block 404 (lines 2641-2645): @media (prefers-reduced-motion: reduce)

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

This block only runs when `(prefers-reduced-motion: reduce)` is true. Inside it, the file changes `*`.

## Block 405 (lines 2647-2664): .cookie-banner

```css
.cookie-banner {
  position: fixed;
  z-index: 25;
  left: 50%;
  bottom: calc(18px + env(safe-area-inset-bottom, 0px));
  width: min(760px, calc(100% - 32px));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
  color: var(--ink);
  box-shadow: 0 18px 55px #17161433;
  transform: translateX(-50%);
}
```

This rule points to things with class `cookie-banner`. It uses `fixed` positioning so it can be placed very deliberately; gives it layer number `25`, like deciding which paper sits on top; positions it using `left: 50%`; positions it using `bottom: calc(18px + env(safe-area-inset-bottom, 0px))`; sets `width` to `min(760px, calc(100% - 32px))`; turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; lines up children with `justify-content: space-between`. It also adds a few more tidy-up settings.

## Block 406 (lines 2665-2667): .cookie-banner[hidden]

```css
.cookie-banner[hidden] {
  display: none;
}
```

This rule points to things with class `cookie-banner` things marked `hidden`. It hides it.

## Block 407 (lines 2668-2673): .cookie-copy

```css
.cookie-copy {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}
```

This rule points to things with class `cookie-copy`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: flex-start`; leaves `12px` between children; sets `min-width` to `0`.

## Block 408 (lines 2674-2685): .cookie-icon

```css
.cookie-icon {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--tint);
  color: var(--brand);
  font-size: 16px;
  font-weight: 800;
}
```

This rule points to things with class `cookie-icon`. It sets `width` to `34px`; sets `height` to `34px`; sets `flex` to `none`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; rounds corners to `50%`; paints the background with `var(--tint)`; sets the text color to `var(--brand)`. It also adds a few more tidy-up settings.

## Block 409 (lines 2686-2691): .cookie-copy h2

```css
.cookie-copy h2 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
}
```

This rule points to things with class `cookie-copy` h2. It adds outside space of `0 0 4px`; shapes the text with `font-size: 14px`; shapes the text with `font-weight: 800`; shapes the text with `letter-spacing: -0.2px`.

## Block 410 (lines 2692-2698): .cookie-copy p

```css
.cookie-copy p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
  font-weight: 600;
}
```

This rule points to things with class `cookie-copy` p. It adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`; shapes the text with `line-height: 1.5`; shapes the text with `font-weight: 600`.

## Block 411 (lines 2699-2703): .cookie-copy a

```css
.cookie-copy a {
  color: var(--brand);
  font-weight: 800;
  text-underline-offset: 2px;
}
```

This rule points to things with class `cookie-copy` a. It sets the text color to `var(--brand)`; shapes the text with `font-weight: 800`; sets `text-underline-offset` to `2px`.

## Block 412 (lines 2704-2709): .cookie-actions

```css
.cookie-actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
}
```

This rule points to things with class `cookie-actions`. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex` to `none`; lines up children with `align-items: center`; leaves `8px` between children.

## Block 413 (lines 2710-2717): .cookie-actions button

```css
.cookie-actions button {
  height: 40px;
  border-radius: 999px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}
```

This rule points to things with class `cookie-actions` button. It sets `height` to `40px`; rounds corners to `999px`; adds inside breathing room of `0 16px`; shapes the text with `font-size: 12px`; shapes the text with `font-weight: 800`; changes the mouse pointer to `pointer`.

## Block 414 (lines 2718-2722): .cookie-reject

```css
.cookie-reject {
  border: 1.5px solid var(--line);
  background: var(--card);
  color: var(--ink);
}
```

This rule points to things with class `cookie-reject`. It draws a border of `1.5px solid var(--line)`; paints the background with `var(--card)`; sets the text color to `var(--ink)`.

## Block 415 (lines 2723-2725): .cookie-reject:hover

```css
.cookie-reject:hover {
  background: var(--bg);
}
```

This rule points to things with class `cookie-reject` while it is being hovered. It paints the background with `var(--bg)`.

## Block 416 (lines 2726-2730): .cookie-accept

```css
.cookie-accept {
  border: 0;
  background: var(--btn);
  color: var(--btn-ink);
}
```

This rule points to things with class `cookie-accept`. It draws a border of `0`; paints the background with `var(--btn)`; sets the text color to `var(--btn-ink)`.

## Block 417 (lines 2731-2733): .cookie-accept:hover

```css
.cookie-accept:hover {
  filter: brightness(1.08);
}
```

This rule points to things with class `cookie-accept` while it is being hovered. It sets `filter` to `brightness(1.08)`.

## Block 418 (lines 2734-2760): @media (max-width: 640px)

```css
@media (max-width: 640px) {
  .cookie-banner {
    bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    width: calc(100% - 20px);
    display: grid;
    gap: 13px;
    padding: 15px;
    border-radius: 16px;
  }
  .cookie-copy {
    gap: 10px;
  }
  .cookie-copy h2 {
    font-size: 13px;
  }
  .cookie-copy p {
    font-size: 11px;
  }
  .cookie-actions {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
  }
  .cookie-actions button {
    height: 42px;
    padding: 0 10px;
  }
}
```

This block only runs when `(max-width: 640px)` is true. Inside it, the file changes `.cookie-banner`, `.cookie-copy`, `.cookie-copy h2`, `.cookie-copy p`, `.cookie-actions`, and more.

## Block 419 (lines 2762-2792): /* NestGH public-site visual system */ body.public-site

```css
/* NestGH public-site visual system */
body.public-site {
  --green-600: #80601a;
  --green-700: #6b5114;
  --green-900: #231d10;
  --green-50: #f0e8d8;
  --bg: #f7f4ee;
  --card: #ffffff;
  --ink: #171614;
  --muted: #6a6358;
  --line: #e7e0d5;
  --gold: #80601a;
  --brand: #80601a;
  --tint: #f0e8d8;
  --fade: rgba(247, 244, 238, 0.9);
  --btn: #171614;
  --btn-ink: #ffffff;
  --g: linear-gradient(135deg, #f4e2a7, #d8b64f 55%, #b18a2e);
  --gi: #231d10;
  --whatsapp: #25d366;
  --accent-orange: #f28c28;
  --accent-blue: #2f6fdb;
  --danger: #d64545;
  --warning: #9b6200;
  --content-width: 1200px;
  background: var(--bg);
  color: var(--ink);
  font-family: "Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
```

This rule points to /* NestGH public-site visual system */ bodythings with class `public-site`. It makes the variable `--green-600` hold `#80601a`; makes the variable `--green-700` hold `#6b5114`; makes the variable `--green-900` hold `#231d10`; makes the variable `--green-50` hold `#f0e8d8`; makes the variable `--bg` hold `#f7f4ee`; makes the variable `--card` hold `#ffffff`; makes the variable `--ink` hold `#171614`; makes the variable `--muted` hold `#6a6358`. It also adds a few more tidy-up settings.

## Block 420 (lines 2794-2812): body.public-site[data-theme="dark"]

```css
body.public-site[data-theme="dark"] {
  --bg: #151513;
  --card: #211f1b;
  --ink: #f3efe7;
  --muted: #b6aea0;
  --line: #39352e;
  --tint: #302b20;
  --green-600: #e2c16a;
  --green-700: #d8b64f;
  --green-900: #f4e2a7;
  --green-50: #302b20;
  --gold: #e2c16a;
  --brand: #e2c16a;
  --btn: #d8b64f;
  --btn-ink: #211b0d;
  --fade: rgba(20, 19, 16, 0.94);
  --g: linear-gradient(135deg, #f4e2a7, #d8b64f 55%, #b18a2e);
  --gi: #231d10;
}
```

This rule points to bodythings with class `public-site` whose data-theme is "dark". It makes the variable `--bg` hold `#151513`; makes the variable `--card` hold `#211f1b`; makes the variable `--ink` hold `#f3efe7`; makes the variable `--muted` hold `#b6aea0`; makes the variable `--line` hold `#39352e`; makes the variable `--tint` hold `#302b20`; makes the variable `--green-600` hold `#e2c16a`; makes the variable `--green-700` hold `#d8b64f`. It also adds a few more tidy-up settings.

## Block 421 (lines 2814-2817): html:has(body.public-site)

```css
html:has(body.public-site) {
  scroll-padding-top: 84px;
  scroll-behavior: smooth;
}
```

This rule points to html:has(bodythings with class `public-site`). It sets `scroll-padding-top` to `84px`; sets `scroll-behavior` to `smooth`.

## Block 422 (lines 2819-2824): body.public-site button, body.public-site select, body.public-site input, bod...

```css
body.public-site button,
body.public-site select,
body.public-site input,
body.public-site textarea {
  font-family: inherit;
}
```

This rule points to bodythings with class `public-site` button and  bodythings with class `public-site` select and  bodythings with class `public-site` input and  bodythings with class `public-site` textarea. It sets `font-family` to `inherit`.

## Block 423 (lines 2826-2829): body.public-site :focus-visible

```css
body.public-site :focus-visible {
  outline: 2px solid var(--green-600);
  outline-offset: 3px;
}
```

This rule points to bodythings with class `public-site`  when keyboard focus is visible. It sets `outline` to `2px solid var(--green-600)`; sets `outline-offset` to `3px`.

## Block 424 (lines 2831-2836): .w

```css
.w {
  width: min(var(--content-width), calc(100% - 32px));
  max-width: var(--content-width);
  padding-right: 0;
  padding-left: 0;
}
```

This rule points to things with class `w`. It sets `width` to `min(var(--content-width), calc(100% - 32px))`; sets `max-width` to `var(--content-width)`; sets `padding-right` to `0`; sets `padding-left` to `0`.

## Block 425 (lines 2838-2846): body.public-site nav

```css
body.public-site nav {
  position: sticky;
  top: 0;
  color: var(--ink);
  background: var(--card);
  border-bottom: 1px solid var(--line);
  box-shadow: none;
  transition: box-shadow 180ms ease;
}
```

This rule points to bodythings with class `public-site` nav. It uses `sticky` positioning so it can be placed very deliberately; positions it using `top: 0`; sets the text color to `var(--ink)`; paints the background with `var(--card)`; sets `border-bottom` to `1px solid var(--line)`; adds a shadow of `none`; makes changes happen smoothly with `box-shadow 180ms ease`.

## Block 426 (lines 2848-2850): body.public-site nav.is-scrolled

```css
body.public-site nav.is-scrolled {
  box-shadow: 0 4px 18px rgba(23, 22, 20, 0.08);
}
```

This rule points to bodythings with class `public-site` navthings with class `is-scrolled`. It adds a shadow of `0 4px 18px rgba(23, 22, 20, 0.08)`.

## Block 427 (lines 2852-2856): body.public-site nav .w

```css
body.public-site nav .w {
  width: min(var(--content-width), calc(100% - 32px));
  height: 72px;
  transition: transform 180ms ease;
}
```

This rule points to bodythings with class `public-site` nav things with class `w`. It sets `width` to `min(var(--content-width), calc(100% - 32px))`; sets `height` to `72px`; makes changes happen smoothly with `transform 180ms ease`.

## Block 428 (lines 2858-2861): body.public-site nav.is-scrolled .w

```css
body.public-site nav.is-scrolled .w {
  transform: scale(0.99);
  transform-origin: center top;
}
```

This rule points to bodythings with class `public-site` navthings with class `is-scrolled` things with class `w`. It moves or reshapes it with `scale(0.99)`; sets `transform-origin` to `center top`.

## Block 429 (lines 2863-2865): body.public-site nav .logo small

```css
body.public-site nav .logo small {
  color: var(--muted);
}
```

This rule points to bodythings with class `public-site` nav things with class `logo` small. It sets the text color to `var(--muted)`.

## Block 430 (lines 2867-2872): .logo

```css
.logo {
  gap: 10px;
  color: var(--ink);
  font-size: 21px;
  letter-spacing: -0.6px;
}
```

This rule points to things with class `logo`. It leaves `10px` between children; sets the text color to `var(--ink)`; shapes the text with `font-size: 21px`; shapes the text with `letter-spacing: -0.6px`.

## Block 431 (lines 2874-2880): .logo i

```css
.logo i {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--green-50);
  color: var(--green-600);
}
```

This rule points to things with class `logo` i. It sets `width` to `40px`; sets `height` to `40px`; rounds corners to `12px`; paints the background with `var(--green-50)`; sets the text color to `var(--green-600)`.

## Block 432 (lines 2882-2885): .logo small

```css
.logo small {
  font-size: 9px;
  letter-spacing: 1.3px;
}
```

This rule points to things with class `logo` small. It shapes the text with `font-size: 9px`; shapes the text with `letter-spacing: 1.3px`.

## Block 433 (lines 2887-2892): .links

```css
.links {
  gap: clamp(14px, 2vw, 28px);
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
}
```

This rule points to things with class `links`. It leaves `clamp(14px, 2vw, 28px)` between children; sets the text color to `var(--ink)`; shapes the text with `font-size: 14px`; shapes the text with `font-weight: 700`.

## Block 434 (lines 2894-2900): .links a

```css
.links a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: inherit;
  transition: color 150ms ease;
}
```

This rule points to things with class `links` a. It sets `min-height` to `44px`; sets `display` to `inline-flex`; lines up children with `align-items: center`; sets the text color to `inherit`; makes changes happen smoothly with `color 150ms ease`.

## Block 435 (lines 2902-2905): .links a:hover, .links a:first-child

```css
.links a:hover,
.links a:first-child {
  color: var(--green-600);
}
```

This rule points to things with class `links` a while it is being hovered and  things with class `links` a when it is the first child. It sets the text color to `var(--green-600)`.

## Block 436 (lines 2907-2909): .links a:first-child

```css
.links a:first-child {
  border-bottom: 2px solid var(--green-600);
}
```

This rule points to things with class `links` a when it is the first child. It sets `border-bottom` to `2px solid var(--green-600)`.

## Block 437 (lines 2911-2917): .btn, .btn2, .go, .ib

```css
.btn,
.btn2,
.go,
.ib {
  min-height: 44px;
  transition: transform 150ms ease, background-color 150ms ease, color 150ms ease;
}
```

This rule points to things with class `btn` and  things with class `btn2` and  things with class `go` and  things with class `ib`. It sets `min-height` to `44px`; makes changes happen smoothly with `transform 150ms ease, background-color 150ms ease, color 150ms ease`.

## Block 438 (lines 2919-2925): .btn

```css
.btn {
  height: 46px;
  border-radius: 12px;
  background: var(--green-600);
  color: #fff;
  font-size: 14px;
}
```

This rule points to things with class `btn`. It sets `height` to `46px`; rounds corners to `12px`; paints the background with `var(--green-600)`; sets the text color to `#fff`; shapes the text with `font-size: 14px`.

## Block 439 (lines 2927-2931): .btn:hover, .go:hover, .btn2:hover

```css
.btn:hover,
.go:hover,
.btn2:hover {
  transform: translateY(-1px);
}
```

This rule points to things with class `btn` while it is being hovered and  things with class `go` while it is being hovered and  things with class `btn2` while it is being hovered. It moves or reshapes it with `translateY(-1px)`.

## Block 440 (lines 2933-2937): .btn:active, .go:active, .btn2:active

```css
.btn:active,
.go:active,
.btn2:active {
  transform: scale(0.98);
}
```

This rule points to things with class `btn`:active and  things with class `go`:active and  things with class `btn2`:active. It moves or reshapes it with `scale(0.98)`.

## Block 441 (lines 2939-2943): .btn.gold, .go

```css
.btn.gold,
.go {
  background: var(--green-600);
  color: #fff;
}
```

This rule points to things with class `btn`things with class `gold` and  things with class `go`. It paints the background with `var(--green-600)`; sets the text color to `#fff`.

## Block 442 (lines 2945-2949): .btn.gold:hover, .go:hover, .cookie-accept:hover

```css
.btn.gold:hover,
.go:hover,
.cookie-accept:hover {
  background: var(--green-700);
}
```

This rule points to things with class `btn`things with class `gold` while it is being hovered and  things with class `go` while it is being hovered and  things with class `cookie-accept` while it is being hovered. It paints the background with `var(--green-700)`.

## Block 443 (lines 2951-2956): .ib

```css
.ib {
  width: 44px;
  height: 44px;
  border-color: var(--line);
  color: var(--green-900);
}
```

This rule points to things with class `ib`. It sets `width` to `44px`; sets `height` to `44px`; sets `border-color` to `var(--line)`; sets the text color to `var(--green-900)`.

## Block 444 (lines 2958-2968): .hero

```css
.hero {
  min-height: 560px;
  display: flex;
  align-items: center;
  padding: 96px 0 112px;
  color: #fff;
  background:
    linear-gradient(90deg, rgba(23, 22, 20, 0.82) 0%, rgba(23, 22, 20, 0.58) 48%, rgba(23, 22, 20, 0.2) 100%),
    linear-gradient(rgba(23, 22, 20, 0.12), rgba(23, 22, 20, 0.2)),
    var(--img) center 52% / cover no-repeat var(--green-900);
}
```

This rule points to things with class `hero`. It sets `min-height` to `560px`; turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; adds inside breathing room of `96px 0 112px`; sets the text color to `#fff`; paints the background with `linear-gradient(90deg, rgba(23, 22, 20, 0.82) 0%, rgba(23, 22, 20, 0.58) 48%, rgba(23, 22, 20, 0.2) 100%), linear-gradient(rgba(23, 22, 20, 0.12), rgba(23, 22, 20, 0.2)), var(--img) center 52% / cover no-repeat var(--green-900)`.

## Block 445 (lines 2970-2972): .hero .w

```css
.hero .w {
  padding-top: 6px;
}
```

This rule points to things with class `hero` things with class `w`. It sets `padding-top` to `6px`.

## Block 446 (lines 2974-2979): .eyebrow

```css
.eyebrow {
  color: var(--green-600);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.035em;
}
```

This rule points to things with class `eyebrow`. It sets the text color to `var(--green-600)`; shapes the text with `font-size: 13px`; shapes the text with `font-weight: 800`; shapes the text with `letter-spacing: 0.035em`.

## Block 447 (lines 2981-2992): .hero .eyebrow

```css
.hero .eyebrow {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 13px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(23, 22, 20, 0.7);
  color: #fff;
  letter-spacing: 0;
}
```

This rule points to things with class `hero` things with class `eyebrow`. It sets `width` to `fit-content`; turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `8px` between children; adds inside breathing room of `8px 13px`; draws a border of `1px solid rgba(255, 255, 255, 0.28)`; rounds corners to `999px`; paints the background with `rgba(23, 22, 20, 0.7)`. It also adds a few more tidy-up settings.

## Block 448 (lines 2994-2997): .hero .eyebrow svg

```css
.hero .eyebrow svg {
  width: 17px;
  height: 17px;
}
```

This rule points to things with class `hero` things with class `eyebrow` svg. It sets `width` to `17px`; sets `height` to `17px`.

## Block 449 (lines 2999-3006): .hero h1

```css
.hero h1 {
  max-width: 12ch;
  margin: 16px 0 14px;
  font-size: clamp(2.5rem, 6vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.045em;
  font-weight: 800;
}
```

This rule points to things with class `hero` h1. It sets `max-width` to `12ch`; adds outside space of `16px 0 14px`; shapes the text with `font-size: clamp(2.5rem, 6vw, 4rem)`; shapes the text with `line-height: 1.02`; shapes the text with `letter-spacing: -0.045em`; shapes the text with `font-weight: 800`.

## Block 450 (lines 3008-3014): .hero p.d

```css
.hero p.d {
  max-width: 44ch;
  color: rgba(255, 255, 255, 0.94);
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  line-height: 1.65;
  font-weight: 500;
}
```

This rule points to things with class `hero` pthings with class `d`. It sets `max-width` to `44ch`; sets the text color to `rgba(255, 255, 255, 0.94)`; shapes the text with `font-size: clamp(1rem, 1.6vw, 1.125rem)`; shapes the text with `line-height: 1.65`; shapes the text with `font-weight: 500`.

## Block 451 (lines 3016-3023): .search

```css
.search {
  margin-top: -54px;
  padding: 20px;
  gap: 12px;
  border: 1px solid rgba(23, 22, 20, 0.06);
  border-radius: 20px;
  box-shadow: 0 8px 28px rgba(23, 22, 20, 0.1);
}
```

This rule points to things with class `search`. It sets `margin-top` to `-54px`; adds inside breathing room of `20px`; leaves `12px` between children; draws a border of `1px solid rgba(23, 22, 20, 0.06)`; rounds corners to `20px`; adds a shadow of `0 8px 28px rgba(23, 22, 20, 0.1)`.

## Block 452 (lines 3025-3030): .f label

```css
.f label {
  min-height: 24px;
  margin-bottom: 5px;
  color: var(--muted);
  font-size: 12px;
}
```

This rule points to things with class `f` label. It sets `min-height` to `24px`; sets `margin-bottom` to `5px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`.

## Block 453 (lines 3032-3034): .f label svg

```css
.f label svg {
  color: var(--green-600);
}
```

This rule points to things with class `f` label svg. It sets the text color to `var(--green-600)`.

## Block 454 (lines 3036-3046): .f select, .f input

```css
.f select,
.f input {
  height: 48px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background-color: var(--bg);
  padding: 0 12px;
  color: var(--ink);
  font-size: 16px;
  font-weight: 500;
}
```

This rule points to things with class `f` select and  things with class `f` input. It sets `height` to `48px`; draws a border of `1px solid var(--line)`; rounds corners to `12px`; sets `background-color` to `var(--bg)`; adds inside breathing room of `0 12px`; sets the text color to `var(--ink)`; shapes the text with `font-size: 16px`; shapes the text with `font-weight: 500`.

## Block 455 (lines 3048-3054): .f select:focus-visible, .f input:focus-visible, .rep select:focus-visible

```css
.f select:focus-visible,
.f input:focus-visible,
.rep select:focus-visible {
  border-color: var(--green-600);
  outline: 2px solid rgba(154, 119, 45, 0.22);
  outline-offset: 1px;
}
```

This rule points to things with class `f` select when keyboard focus is visible and  things with class `f` input when keyboard focus is visible and  things with class `rep` select when keyboard focus is visible. It sets `border-color` to `var(--green-600)`; sets `outline` to `2px solid rgba(154, 119, 45, 0.22)`; sets `outline-offset` to `1px`.

## Block 456 (lines 3056-3059): .town-control input

```css
.town-control input {
  width: 100%;
  min-width: 0;
}
```

This rule points to things with class `town-control` input. It sets `width` to `100%`; sets `min-width` to `0`.

## Block 457 (lines 3061-3066): .go

```css
.go {
  height: 48px;
  min-width: 116px;
  border-radius: 12px;
  font-size: 15px;
}
```

This rule points to things with class `go`. It sets `height` to `48px`; sets `min-width` to `116px`; rounds corners to `12px`; shapes the text with `font-size: 15px`.

## Block 458 (lines 3068-3071): .location-status, .location-credit

```css
.location-status,
.location-credit {
  font-size: 13px;
}
```

This rule points to things with class `location-status` and  things with class `location-credit`. It shapes the text with `font-size: 13px`.

## Block 459 (lines 3073-3078): .location-credit a, .section-link, .mp, .pc a

```css
.location-credit a,
.section-link,
.mp,
.pc a {
  color: var(--green-700);
}
```

This rule points to things with class `location-credit` a and  things with class `section-link` and  things with class `mp` and  things with class `pc` a. It sets the text color to `var(--green-700)`.

## Block 460 (lines 3080-3083): .opts

```css
.opts {
  gap: 10px;
  margin-top: 16px;
}
```

This rule points to things with class `opts`. It leaves `10px` between children; sets `margin-top` to `16px`.

## Block 461 (lines 3085-3088): .opts > b, .stu

```css
.opts > b,
.stu {
  font-size: 13px;
}
```

This rule points to things with class `opts`  directly inside  b and  things with class `stu`. It shapes the text with `font-size: 13px`.

## Block 462 (lines 3090-3097): .mh

```css
.mh {
  min-height: 40px;
  padding: 6px 14px;
  border-color: var(--line);
  background: var(--card);
  color: var(--ink);
  font-size: 13px;
}
```

This rule points to things with class `mh`. It sets `min-height` to `40px`; adds inside breathing room of `6px 14px`; sets `border-color` to `var(--line)`; paints the background with `var(--card)`; sets the text color to `var(--ink)`; shapes the text with `font-size: 13px`.

## Block 463 (lines 3099-3103): .mh[aria-pressed="true"]

```css
.mh[aria-pressed="true"] {
  border-color: var(--green-600);
  background: var(--green-50);
  color: var(--green-700);
}
```

This rule points to things with class `mh` whose aria-pressed is "true". It sets `border-color` to `var(--green-600)`; paints the background with `var(--green-50)`; sets the text color to `var(--green-700)`.

## Block 464 (lines 3105-3111): .trust

```css
.trust {
  margin: 32px auto 0;
  width: min(var(--content-width), calc(100% - 32px));
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--card);
}
```

This rule points to things with class `trust`. It adds outside space of `32px auto 0`; sets `width` to `min(var(--content-width), calc(100% - 32px))`; draws a border of `1px solid var(--line)`; rounds corners to `18px`; paints the background with `var(--card)`.

## Block 465 (lines 3113-3117): .trust .w

```css
.trust .w {
  width: 100%;
  padding: 22px 24px;
  gap: 18px;
}
```

This rule points to things with class `trust` things with class `w`. It sets `width` to `100%`; adds inside breathing room of `22px 24px`; leaves `18px` between children.

## Block 466 (lines 3119-3122): .tr

```css
.tr {
  display: block;
  text-align: center;
}
```

This rule points to things with class `tr`. It sets `display` to `block`; sets `text-align` to `center`.

## Block 467 (lines 3123-3132): .tr i

```css
.tr i {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: var(--green-50);
  color: var(--green-600);
}
```

This rule points to things with class `tr` i. It turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; sets `width` to `56px`; sets `height` to `56px`; adds outside space of `0 auto 12px`; rounds corners to `50%`; paints the background with `var(--green-50)`; sets the text color to `var(--green-600)`.

## Block 468 (lines 3133-3137): .tr b

```css
.tr b {
  display: block;
  font-size: 15px;
  font-weight: 800;
}
```

This rule points to things with class `tr` b. It sets `display` to `block`; shapes the text with `font-size: 15px`; shapes the text with `font-weight: 800`.

## Block 469 (lines 3138-3144): .tr span

```css
.tr span {
  display: block;
  margin: 4px auto 0;
  max-width: 220px;
  font-size: 13px;
  line-height: 1.45;
}
```

This rule points to things with class `tr` span. It sets `display` to `block`; adds outside space of `4px auto 0`; sets `max-width` to `220px`; shapes the text with `font-size: 13px`; shapes the text with `line-height: 1.45`.

## Block 470 (lines 3146-3149): .sec

```css
.sec {
  padding: 64px 0 8px;
  scroll-margin-top: 88px;
}
```

This rule points to things with class `sec`. It adds inside breathing room of `64px 0 8px`; sets `scroll-margin-top` to `88px`.

## Block 471 (lines 3151-3154): .head

```css
.head {
  align-items: center;
  margin-bottom: 20px;
}
```

This rule points to things with class `head`. It lines up children with `align-items: center`; sets `margin-bottom` to `20px`.

## Block 472 (lines 3156-3162): .head h2, .marketplace-intro h2

```css
.head h2,
.marketplace-intro h2 {
  font-size: clamp(1.5rem, 2.5vw, 1.9rem);
  line-height: 1.15;
  letter-spacing: -0.035em;
  font-weight: 800;
}
```

This rule points to things with class `head` h2 and  things with class `marketplace-intro` h2. It shapes the text with `font-size: clamp(1.5rem, 2.5vw, 1.9rem)`; shapes the text with `line-height: 1.15`; shapes the text with `letter-spacing: -0.035em`; shapes the text with `font-weight: 800`.

## Block 473 (lines 3164-3172): .section-link

```css
.section-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
}
```

This rule points to things with class `section-link`. It sets `display` to `inline-flex`; sets `min-height` to `44px`; lines up children with `align-items: center`; leaves `8px` between children; shapes the text with `font-size: 14px`; shapes the text with `font-weight: 800`; sets `text-decoration` to `none`.

## Block 474 (lines 3174-3178): .category-grid

```css
.category-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
}
```

This rule points to things with class `category-grid`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(6, minmax(0, 1fr))`; leaves `14px` between children.

## Block 475 (lines 3180-3198): .category-card

```css
.category-card {
  min-width: 0;
  min-height: 136px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 10px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
  color: var(--ink);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(23, 22, 20, 0.04);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
```

This rule points to things with class `category-card`. It sets `min-width` to `0`; sets `min-height` to `136px`; turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-direction` to `column`; lines up children with `align-items: center`; lines up children with `justify-content: center`; leaves `10px` between children; adds inside breathing room of `14px 10px`. It also adds a few more tidy-up settings.

## Block 476 (lines 3200-3205): .category-card:hover, .category-card[aria-pressed="true"]

```css
.category-card:hover,
.category-card[aria-pressed="true"] {
  transform: translateY(-2px);
  border-color: var(--green-600);
  box-shadow: 0 8px 22px rgba(23, 22, 20, 0.08);
}
```

This rule points to things with class `category-card` while it is being hovered and  things with class `category-card` whose aria-pressed is "true". It moves or reshapes it with `translateY(-2px)`; sets `border-color` to `var(--green-600)`; adds a shadow of `0 8px 22px rgba(23, 22, 20, 0.08)`.

## Block 477 (lines 3207-3209): .category-card > span:last-child

```css
.category-card > span:last-child {
  min-width: 0;
}
```

This rule points to things with class `category-card`  directly inside  span when it is the last child. It sets `min-width` to `0`.

## Block 478 (lines 3211-3214): .category-card b, .category-card small

```css
.category-card b,
.category-card small {
  display: block;
}
```

This rule points to things with class `category-card` b and  things with class `category-card` small. It sets `display` to `block`.

## Block 479 (lines 3216-3219): .category-card b

```css
.category-card b {
  font-size: 15px;
  line-height: 1.3;
}
```

This rule points to things with class `category-card` b. It shapes the text with `font-size: 15px`; shapes the text with `line-height: 1.3`.

## Block 480 (lines 3221-3226): .category-card small

```css
.category-card small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
}
```

This rule points to things with class `category-card` small. It sets `margin-top` to `4px`; sets the text color to `var(--muted)`; shapes the text with `font-size: 12px`; shapes the text with `line-height: 1.35`.

## Block 481 (lines 3228-3237): .category-icon

```css
.category-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--green-50);
  color: var(--green-600);
}
```

This rule points to things with class `category-icon`. It sets `width` to `46px`; sets `height` to `46px`; sets `flex` to `0 0 46px`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; rounds corners to `50%`; paints the background with `var(--green-50)`; sets the text color to `var(--green-600)`.

## Block 482 (lines 3239-3242): .category-card[data-category="shops"] .category-icon

```css
.category-card[data-category="shops"] .category-icon {
  background: #fff1df;
  color: #bd6b18;
}
```

This rule points to things with class `category-card` whose data-category is "shops"  things with class `category-icon`. It paints the background with `#fff1df`; sets the text color to `#bd6b18`.

## Block 483 (lines 3244-3247): .category-card[data-category="offices"] .category-icon

```css
.category-card[data-category="offices"] .category-icon {
  background: #eaf0ff;
  color: #315fc0;
}
```

This rule points to things with class `category-card` whose data-category is "offices"  things with class `category-icon`. It paints the background with `#eaf0ff`; sets the text color to `#315fc0`.

## Block 484 (lines 3249-3252): .category-card[data-category="warehouses"] .category-icon

```css
.category-card[data-category="warehouses"] .category-icon {
  background: #e5eef2;
  color: #315a70;
}
```

This rule points to things with class `category-card` whose data-category is "warehouses"  things with class `category-icon`. It paints the background with `#e5eef2`; sets the text color to `#315a70`.

## Block 485 (lines 3254-3259): .category-icon svg, .feature-card > svg

```css
.category-icon svg,
.feature-card > svg {
  width: 23px;
  height: 23px;
  stroke-width: 1.75;
}
```

This rule points to things with class `category-icon` svg and  things with class `feature-card`  directly inside  svg. It sets `width` to `23px`; sets `height` to `23px`; sets `stroke-width` to `1.75`.

## Block 486 (lines 3261-3266): #rooms, #how, #listroom, #top

```css
#rooms,
#how,
#listroom,
#top {
  scroll-margin-top: 88px;
}
```

This rule points to the one with id `rooms` and  the one with id `how` and  the one with id `listroom` and  the one with id `top`. It sets `scroll-margin-top` to `88px`.

## Block 487 (lines 3268-3270): #rooms .head

```css
#rooms .head {
  align-items: flex-end;
}
```

This rule points to the one with id `rooms` things with class `head`. It lines up children with `align-items: flex-end`.

## Block 488 (lines 3272-3277): #clr

```css
#clr {
  min-height: 44px;
  padding: 0 10px;
  border-radius: 10px;
  color: var(--green-700);
}
```

This rule points to the one with id `clr`. It sets `min-height` to `44px`; adds inside breathing room of `0 10px`; rounds corners to `10px`; sets the text color to `var(--green-700)`.

## Block 489 (lines 3279-3281): .grid

```css
.grid {
  gap: 18px;
}
```

This rule points to things with class `grid`. It leaves `18px` between children.

## Block 490 (lines 3283-3288): .card

```css
.card {
  border-color: var(--line);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(23, 22, 20, 0.06);
  transition: transform 180ms ease, border-color 180ms ease;
}
```

This rule points to things with class `card`. It sets `border-color` to `var(--line)`; rounds corners to `16px`; adds a shadow of `0 2px 12px rgba(23, 22, 20, 0.06)`; makes changes happen smoothly with `transform 180ms ease, border-color 180ms ease`.

## Block 491 (lines 3290-3295): .pic

```css
.pic {
  height: auto;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--green-50);
}
```

This rule points to things with class `pic`. It sets `height` to `auto`; sets `aspect-ratio` to `4 / 3`; controls spillover with `hidden`; paints the background with `var(--green-50)`.

## Block 492 (lines 3297-3300): .pic > img, .pic svg

```css
.pic > img,
.pic svg {
  transition: transform 400ms ease;
}
```

This rule points to things with class `pic`  directly inside  img and  things with class `pic` svg. It makes changes happen smoothly with `transform 400ms ease`.

## Block 493 (lines 3302-3309): .ty

```css
.ty {
  top: 12px;
  left: 12px;
  padding: 6px 11px;
  background: var(--green-900);
  color: #fff;
  font-size: 12px;
}
```

This rule points to things with class `ty`. It positions it using `top: 12px`; positions it using `left: 12px`; adds inside breathing room of `6px 11px`; paints the background with `var(--green-900)`; sets the text color to `#fff`; shapes the text with `font-size: 12px`.

## Block 494 (lines 3311-3320): .hb

```css
.hb {
  top: 10px;
  right: 10px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  background: #fff;
  color: var(--green-900);
}
```

This rule points to things with class `hb`. It positions it using `top: 10px`; positions it using `right: 10px`; sets `width` to `44px`; sets `height` to `44px`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; paints the background with `#fff`; sets the text color to `var(--green-900)`.

## Block 495 (lines 3322-3325): .hb[aria-pressed="true"] svg

```css
.hb[aria-pressed="true"] svg {
  fill: var(--green-600);
  stroke: var(--green-600);
}
```

This rule points to things with class `hb` whose aria-pressed is "true"  svg. It sets `fill` to `var(--green-600)`; sets `stroke` to `var(--green-600)`.

## Block 496 (lines 3327-3330): .b

```css
.b {
  gap: 9px;
  padding: 16px;
}
```

This rule points to things with class `b`. It leaves `9px` between children; adds inside breathing room of `16px`.

## Block 497 (lines 3332-3335): .b h3

```css
.b h3 {
  font-size: 17px;
  line-height: 1.3;
}
```

This rule points to things with class `b` h3. It shapes the text with `font-size: 17px`; shapes the text with `line-height: 1.3`.

## Block 498 (lines 3337-3340): .loc

```css
.loc {
  gap: 7px;
  font-size: 13px;
}
```

This rule points to things with class `loc`. It leaves `7px` between children; shapes the text with `font-size: 13px`.

## Block 499 (lines 3342-3344): .loc svg

```css
.loc svg {
  color: var(--green-600);
}
```

This rule points to things with class `loc` svg. It sets the text color to `var(--green-600)`.

## Block 500 (lines 3346-3350): .fac span

```css
.fac span {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
}
```

This rule points to things with class `fac` span. It rounds corners to `999px`; adds inside breathing room of `4px 10px`; shapes the text with `font-size: 12px`.

## Block 501 (lines 3352-3354): .meta

```css
.meta {
  font-size: 12px;
}
```

This rule points to things with class `meta`. It shapes the text with `font-size: 12px`.

## Block 502 (lines 3356-3358): .meta b

```css
.meta b {
  color: var(--green-700);
}
```

This rule points to things with class `meta` b. It sets the text color to `var(--green-700)`.

## Block 503 (lines 3360-3363): .pr

```css
.pr {
  color: var(--green-700);
  font-size: 21px;
}
```

This rule points to things with class `pr`. It sets the text color to `var(--green-700)`; shapes the text with `font-size: 21px`.

## Block 504 (lines 3365-3367): .pr small

```css
.pr small {
  color: var(--muted);
}
```

This rule points to things with class `pr` small. It sets the text color to `var(--muted)`.

## Block 505 (lines 3369-3371): .ft

```css
.ft {
  padding-top: 14px;
}
```

This rule points to things with class `ft`. It sets `padding-top` to `14px`.

## Block 506 (lines 3373-3375): .acts

```css
.acts {
  gap: 8px;
}
```

This rule points to things with class `acts`. It leaves `8px` between children.

## Block 507 (lines 3377-3379): .acts a

```css
.acts a {
  height: 44px;
}
```

This rule points to things with class `acts` a. It sets `height` to `44px`.

## Block 508 (lines 3381-3384): .wa

```css
.wa {
  background: var(--whatsapp);
  color: #07351c;
}
```

This rule points to things with class `wa`. It paints the background with `var(--whatsapp)`; sets the text color to `#07351c`.

## Block 509 (lines 3386-3390): .call

```css
.call {
  width: 44px;
  border-color: var(--green-600);
  color: var(--green-700);
}
```

This rule points to things with class `call`. It sets `width` to `44px`; sets `border-color` to `var(--green-600)`; sets the text color to `var(--green-700)`.

## Block 510 (lines 3392-3396): .empty

```css
.empty {
  border-color: var(--line);
  border-radius: 16px;
  padding: 32px 20px;
}
```

This rule points to things with class `empty`. It sets `border-color` to `var(--line)`; rounds corners to `16px`; adds inside breathing room of `32px 20px`.

## Block 511 (lines 3398-3400): .empty b

```css
.empty b {
  font-size: 17px;
}
```

This rule points to things with class `empty` b. It shapes the text with `font-size: 17px`.

## Block 512 (lines 3402-3405): .empty p

```css
.empty p {
  color: var(--muted);
  font-size: 14px;
}
```

This rule points to things with class `empty` p. It sets the text color to `var(--muted)`; shapes the text with `font-size: 14px`.

## Block 513 (lines 3407-3411): .btn2

```css
.btn2 {
  min-height: 44px;
  border-color: var(--line);
  border-radius: 12px;
}
```

This rule points to things with class `btn2`. It sets `min-height` to `44px`; sets `border-color` to `var(--line)`; rounds corners to `12px`.

## Block 514 (lines 3413-3416): .marketplace-intro

```css
.marketplace-intro {
  max-width: 680px;
  margin-bottom: 24px;
}
```

This rule points to things with class `marketplace-intro`. It sets `max-width` to `680px`; sets `margin-bottom` to `24px`.

## Block 515 (lines 3418-3420): .marketplace-intro h2

```css
.marketplace-intro h2 {
  margin: 0 0 12px;
}
```

This rule points to things with class `marketplace-intro` h2. It adds outside space of `0 0 12px`.

## Block 516 (lines 3422-3427): .marketplace-intro > p:not(.eyebrow):not(.marketplace-steps)

```css
.marketplace-intro > p:not(.eyebrow):not(.marketplace-steps) {
  max-width: 58ch;
  margin: 0;
  color: var(--muted);
  font-size: 16px;
}
```

This rule points to things with class `marketplace-intro`  directly inside  p but not things with class `eyebrow` but not things with class `marketplace-steps`. It sets `max-width` to `58ch`; adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 16px`.

## Block 517 (lines 3429-3434): .marketplace-steps

```css
.marketplace-steps {
  margin: 16px 0 0;
  color: var(--green-700);
  font-size: 14px;
  font-weight: 800;
}
```

This rule points to things with class `marketplace-steps`. It adds outside space of `16px 0 0`; sets the text color to `var(--green-700)`; shapes the text with `font-size: 14px`; shapes the text with `font-weight: 800`.

## Block 518 (lines 3436-3439): .marketplace-steps span

```css
.marketplace-steps span {
  margin: 0 5px;
  color: var(--muted);
}
```

This rule points to things with class `marketplace-steps` span. It adds outside space of `0 5px`; sets the text color to `var(--muted)`.

## Block 519 (lines 3441-3445): .feature-grid

```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
```

This rule points to things with class `feature-grid`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(3, minmax(0, 1fr))`; leaves `14px` between children.

## Block 520 (lines 3447-3456): .feature-card

```css
.feature-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
}
```

This rule points to things with class `feature-card`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: flex-start`; leaves `14px` between children; sets `min-width` to `0`; adds inside breathing room of `18px`; draws a border of `1px solid var(--line)`; rounds corners to `16px`; paints the background with `var(--card)`.

## Block 521 (lines 3458-3466): .feature-card > svg

```css
.feature-card > svg {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  padding: 10px;
  border-radius: 13px;
  background: var(--green-50);
  color: var(--green-600);
}
```

This rule points to things with class `feature-card`  directly inside  svg. It sets `width` to `44px`; sets `height` to `44px`; sets `flex` to `0 0 44px`; adds inside breathing room of `10px`; rounds corners to `13px`; paints the background with `var(--green-50)`; sets the text color to `var(--green-600)`.

## Block 522 (lines 3468-3472): .feature-card h3

```css
.feature-card h3 {
  margin: 1px 0 4px;
  font-size: 15px;
  line-height: 1.35;
}
```

This rule points to things with class `feature-card` h3. It adds outside space of `1px 0 4px`; shapes the text with `font-size: 15px`; shapes the text with `line-height: 1.35`.

## Block 523 (lines 3474-3479): .feature-card p

```css
.feature-card p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}
```

This rule points to things with class `feature-card` p. It adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 13px`; shapes the text with `line-height: 1.5`.

## Block 524 (lines 3481-3491): .cta

```css
.cta {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 56px 0 64px;
  padding: 26px 30px;
  border: 1px solid #d8e9de;
  border-radius: 20px;
  background: var(--green-50);
  color: var(--ink);
}
```

This rule points to things with class `cta`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `18px` between children; adds outside space of `56px 0 64px`; adds inside breathing room of `26px 30px`; draws a border of `1px solid #d8e9de`; rounds corners to `20px`; paints the background with `var(--green-50)`. It also adds a few more tidy-up settings.

## Block 525 (lines 3493-3502): .cta-icon

```css
.cta-icon {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  display: grid;
  place-items: center;
  border-radius: 17px;
  background: var(--green-600);
  color: #fff;
}
```

This rule points to things with class `cta-icon`. It sets `width` to `58px`; sets `height` to `58px`; sets `flex` to `0 0 58px`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`; rounds corners to `17px`; paints the background with `var(--green-600)`; sets the text color to `#fff`.

## Block 526 (lines 3504-3507): .cta-icon svg

```css
.cta-icon svg {
  width: 28px;
  height: 28px;
}
```

This rule points to things with class `cta-icon` svg. It sets `width` to `28px`; sets `height` to `28px`.

## Block 527 (lines 3509-3511): .cta-copy

```css
.cta-copy {
  flex: 1;
}
```

This rule points to things with class `cta-copy`. It sets `flex` to `1`.

## Block 528 (lines 3513-3518): .cta h2

```css
.cta h2 {
  margin: 0 0 4px;
  color: var(--green-900);
  font-size: 23px;
  letter-spacing: -0.03em;
}
```

This rule points to things with class `cta` h2. It adds outside space of `0 0 4px`; sets the text color to `var(--green-900)`; shapes the text with `font-size: 23px`; shapes the text with `letter-spacing: -0.03em`.

## Block 529 (lines 3520-3524): .cta p

```css
.cta p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}
```

This rule points to things with class `cta` p. It adds outside space of `0`; sets the text color to `var(--muted)`; shapes the text with `font-size: 15px`.

## Block 530 (lines 3526-3528): .cta .btn

```css
.cta .btn {
  flex: 0 0 auto;
}
```

This rule points to things with class `cta` things with class `btn`. It sets `flex` to `0 0 auto`.

## Block 531 (lines 3530-3536): .cta-art

```css
.cta-art {
  width: clamp(110px, 15vw, 190px);
  height: auto;
  flex: 0 1 190px;
  align-self: stretch;
  max-height: 100px;
}
```

This rule points to things with class `cta-art`. It sets `width` to `clamp(110px, 15vw, 190px)`; sets `height` to `auto`; sets `flex` to `0 1 190px`; sets `align-self` to `stretch`; sets `max-height` to `100px`.

## Block 532 (lines 3538-3542): footer

```css
footer {
  padding: 0 0 24px;
  background: var(--green-900);
  color: #fff;
}
```

This rule points to footer. It adds inside breathing room of `0 0 24px`; paints the background with `var(--green-900)`; sets the text color to `#fff`.

## Block 533 (lines 3544-3546): footer .w

```css
footer .w {
  padding-top: 26px;
}
```

This rule points to footer things with class `w`. It sets `padding-top` to `26px`.

## Block 534 (lines 3548-3554): .audience-grid

```css
.audience-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  padding: 0 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
```

This rule points to things with class `audience-grid`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(4, minmax(0, 1fr))`; leaves `14px` between children; adds inside breathing room of `0 0 24px`; sets `border-bottom` to `1px solid rgba(255, 255, 255, 0.2)`.

## Block 535 (lines 3556-3561): .audience-item

```css
.audience-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}
```

This rule points to things with class `audience-item`. It turns on **flexbox**, which lines children up like toys in a row or column; lines up children with `align-items: center`; leaves `11px` between children; sets `min-width` to `0`.

## Block 536 (lines 3563-3571): .audience-item > svg

```css
.audience-item > svg {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 12px;
  color: #fff;
}
```

This rule points to things with class `audience-item`  directly inside  svg. It sets `width` to `38px`; sets `height` to `38px`; sets `flex` to `0 0 38px`; adds inside breathing room of `8px`; draws a border of `1px solid rgba(255, 255, 255, 0.32)`; rounds corners to `12px`; sets the text color to `#fff`.

## Block 537 (lines 3573-3576): .audience-item b, .audience-item small

```css
.audience-item b,
.audience-item small {
  display: block;
}
```

This rule points to things with class `audience-item` b and  things with class `audience-item` small. It sets `display` to `block`.

## Block 538 (lines 3578-3580): .audience-item b

```css
.audience-item b {
  font-size: 14px;
}
```

This rule points to things with class `audience-item` b. It shapes the text with `font-size: 14px`.

## Block 539 (lines 3582-3587): .audience-item small

```css
.audience-item small {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 1.35;
}
```

This rule points to things with class `audience-item` small. It sets `margin-top` to `2px`; sets the text color to `rgba(255, 255, 255, 0.78)`; shapes the text with `font-size: 12px`; shapes the text with `line-height: 1.35`.

## Block 540 (lines 3589-3593): .fg

```css
.fg {
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 24px;
  padding: 24px 0;
}
```

This rule points to things with class `fg`. It chooses the grid columns as `1.5fr 1fr 1fr`; leaves `24px` between children; adds inside breathing room of `24px 0`.

## Block 541 (lines 3595-3598): footer .logo, footer .logo small

```css
footer .logo,
footer .logo small {
  color: #fff;
}
```

This rule points to footer things with class `logo` and  footer things with class `logo` small. It sets the text color to `#fff`.

## Block 542 (lines 3600-3603): footer .logo i

```css
footer .logo i {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
```

This rule points to footer things with class `logo` i. It paints the background with `rgba(255, 255, 255, 0.12)`; sets the text color to `#fff`.

## Block 543 (lines 3605-3612): .footer-tagline

```css
.footer-tagline {
  display: block;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
}
```

This rule points to things with class `footer-tagline`. It sets `display` to `block`; sets `margin-top` to `6px`; sets the text color to `rgba(255, 255, 255, 0.76)`; shapes the text with `font-size: 12px`; shapes the text with `font-weight: 500`; shapes the text with `letter-spacing: 0`.

## Block 544 (lines 3614-3618): .fg h3

```css
.fg h3 {
  margin-bottom: 12px;
  color: #fff;
  font-size: 14px;
}
```

This rule points to things with class `fg` h3. It sets `margin-bottom` to `12px`; sets the text color to `#fff`; shapes the text with `font-size: 14px`.

## Block 545 (lines 3620-3625): .fg a, .fg p, .fb, .fb a

```css
.fg a,
.fg p,
.fb,
.fb a {
  color: rgba(255, 255, 255, 0.8);
}
```

This rule points to things with class `fg` a and  things with class `fg` p and  things with class `fb` and  things with class `fb` a. It sets the text color to `rgba(255, 255, 255, 0.8)`.

## Block 546 (lines 3627-3630): .fg a:hover, .fb a:hover

```css
.fg a:hover,
.fb a:hover {
  color: #fff;
}
```

This rule points to things with class `fg` a while it is being hovered and  things with class `fb` a while it is being hovered. It sets the text color to `#fff`.

## Block 547 (lines 3632-3637): .fb

```css
.fb {
  margin-top: 0;
  padding-top: 18px;
  border-color: rgba(255, 255, 255, 0.2);
  font-size: 12px;
}
```

This rule points to things with class `fb`. It sets `margin-top` to `0`; sets `padding-top` to `18px`; sets `border-color` to `rgba(255, 255, 255, 0.2)`; shapes the text with `font-size: 12px`.

## Block 548 (lines 3639-3644): .fb > span:last-child

```css
.fb > span:last-child {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
```

This rule points to things with class `fb`  directly inside  span when it is the last child. It turns on **flexbox**, which lines children up like toys in a row or column; sets `flex-wrap` to `wrap`; lines up children with `align-items: center`; leaves `16px` between children.

## Block 549 (lines 3646-3648): .fb a

```css
.fb a {
  margin: 0;
}
```

This rule points to things with class `fb` a. It adds outside space of `0`.

## Block 550 (lines 3650-3654): .ghana-badge

```css
.ghana-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
```

This rule points to things with class `ghana-badge`. It sets `display` to `inline-flex`; lines up children with `align-items: center`; leaves `6px` between children.

## Block 551 (lines 3656-3675): .back-to-top

```css
.back-to-top {
  position: fixed;
  z-index: 19;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 14px;
  background: var(--green-600);
  color: #fff;
  box-shadow: 0 4px 16px rgba(23, 22, 20, 0.18);
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms ease;
}
```

This rule points to things with class `back-to-top`. It uses `fixed` positioning so it can be placed very deliberately; gives it layer number `19`, like deciding which paper sits on top; positions it using `right: 20px`; positions it using `bottom: calc(20px + env(safe-area-inset-bottom, 0px))`; sets `width` to `48px`; sets `height` to `48px`; turns on **grid**, which lays children out like boxes on graph paper; lines up children with `place-items: center`. It also adds a few more tidy-up settings.

## Block 552 (lines 3677-3679): .back-to-top[hidden]

```css
.back-to-top[hidden] {
  display: none;
}
```

This rule points to things with class `back-to-top` things marked `hidden`. It hides it.

## Block 553 (lines 3681-3685): .back-to-top[data-visible]

```css
.back-to-top[data-visible] {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

This rule points to things with class `back-to-top`[data-visible]. It makes it `1` see-through; moves or reshapes it with `translateY(0)`; sets `pointer-events` to `auto`.

## Block 554 (lines 3687-3689): .back-to-top svg

```css
.back-to-top svg {
  transform: rotate(-90deg);
}
```

This rule points to things with class `back-to-top` svg. It moves or reshapes it with `rotate(-90deg)`.

## Block 555 (lines 3691-3695): .js [data-reveal]

```css
.js [data-reveal] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

This rule points to things with class `js` [data-reveal]. It makes it `0` see-through; moves or reshapes it with `translateY(16px)`; makes changes happen smoothly with `opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1)`.

## Block 556 (lines 3697-3699): .js [data-reveal="fade"]

```css
.js [data-reveal="fade"] {
  transform: none;
}
```

This rule points to things with class `js`  whose data-reveal is "fade". It moves or reshapes it with `none`.

## Block 557 (lines 3701-3703): .js [data-reveal="fade-left"]

```css
.js [data-reveal="fade-left"] {
  transform: translateX(16px);
}
```

This rule points to things with class `js`  whose data-reveal is "fade-left". It moves or reshapes it with `translateX(16px)`.

## Block 558 (lines 3705-3707): .js [data-reveal="fade-right"]

```css
.js [data-reveal="fade-right"] {
  transform: translateX(-16px);
}
```

This rule points to things with class `js`  whose data-reveal is "fade-right". It moves or reshapes it with `translateX(-16px)`.

## Block 559 (lines 3709-3711): .js [data-reveal="scale-in"]

```css
.js [data-reveal="scale-in"] {
  transform: scale(0.97);
}
```

This rule points to things with class `js`  whose data-reveal is "scale-in". It moves or reshapes it with `scale(0.97)`.

## Block 560 (lines 3713-3716): .js [data-reveal].is-revealed

```css
.js [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
}
```

This rule points to things with class `js` [data-reveal]things with class `is-revealed`. It makes it `1` see-through; moves or reshapes it with `none`.

## Block 561 (lines 3718-3721): @keyframes listing-panel-enter

```css
@keyframes listing-panel-enter {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

This block defines the animation named `listing-panel-enter`. Think of it like a tiny flipbook that tells the page how something should move or shimmer over time.

## Block 562 (lines 3723-3726): @keyframes listing-step-enter

```css
@keyframes listing-step-enter {
  from { opacity: 0; transform: translateY(9px); }
  to { opacity: 1; transform: translateY(0); }
}
```

This block defines the animation named `listing-step-enter`. Think of it like a tiny flipbook that tells the page how something should move or shimmer over time.

## Block 563 (lines 3728-3731): @keyframes listing-card-enter

```css
@keyframes listing-card-enter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

This block defines the animation named `listing-card-enter`. Think of it like a tiny flipbook that tells the page how something should move or shimmer over time.

## Block 564 (lines 3733-3743): @media (hover: hover) and (prefers-reduced-motion: no-preference)

```css
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  body.public-site button:not(:disabled),
  body.public-site a.btn {
    transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  }

  body.public-site button:not(:disabled):hover,
  body.public-site a.btn:hover {
    transform: translateY(-1px);
  }
}
```

This block only runs when `(hover: hover) and (prefers-reduced-motion: no-preference)` is true. Inside it, the file changes `body.public-site a.btn`, `body.public-site a.btn:hover`.

## Block 565 (lines 3745-3748): .category-grid > :nth-child(1), .feature-grid > :nth-child(1)

```css
.category-grid > :nth-child(1),
.feature-grid > :nth-child(1) {
  transition-delay: 0ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 1 and  things with class `feature-grid`  directly inside   when it is child number 1. It sets `transition-delay` to `0ms`.

## Block 566 (lines 3750-3753): .category-grid > :nth-child(2), .feature-grid > :nth-child(2)

```css
.category-grid > :nth-child(2),
.feature-grid > :nth-child(2) {
  transition-delay: 70ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 2 and  things with class `feature-grid`  directly inside   when it is child number 2. It sets `transition-delay` to `70ms`.

## Block 567 (lines 3755-3758): .category-grid > :nth-child(3), .feature-grid > :nth-child(3)

```css
.category-grid > :nth-child(3),
.feature-grid > :nth-child(3) {
  transition-delay: 140ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 3 and  things with class `feature-grid`  directly inside   when it is child number 3. It sets `transition-delay` to `140ms`.

## Block 568 (lines 3760-3763): .category-grid > :nth-child(4), .feature-grid > :nth-child(4)

```css
.category-grid > :nth-child(4),
.feature-grid > :nth-child(4) {
  transition-delay: 210ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 4 and  things with class `feature-grid`  directly inside   when it is child number 4. It sets `transition-delay` to `210ms`.

## Block 569 (lines 3765-3768): .category-grid > :nth-child(5), .feature-grid > :nth-child(5)

```css
.category-grid > :nth-child(5),
.feature-grid > :nth-child(5) {
  transition-delay: 280ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 5 and  things with class `feature-grid`  directly inside   when it is child number 5. It sets `transition-delay` to `280ms`.

## Block 570 (lines 3770-3773): .category-grid > :nth-child(6), .feature-grid > :nth-child(6)

```css
.category-grid > :nth-child(6),
.feature-grid > :nth-child(6) {
  transition-delay: 350ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 6 and  things with class `feature-grid`  directly inside   when it is child number 6. It sets `transition-delay` to `350ms`.

## Block 571 (lines 3775-3778): .category-grid > :nth-child(7), .feature-grid > :nth-child(7)

```css
.category-grid > :nth-child(7),
.feature-grid > :nth-child(7) {
  transition-delay: 420ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 7 and  things with class `feature-grid`  directly inside   when it is child number 7. It sets `transition-delay` to `420ms`.

## Block 572 (lines 3780-3783): .category-grid > :nth-child(8), .feature-grid > :nth-child(8)

```css
.category-grid > :nth-child(8),
.feature-grid > :nth-child(8) {
  transition-delay: 490ms;
}
```

This rule points to things with class `category-grid`  directly inside   when it is child number 8 and  things with class `feature-grid`  directly inside   when it is child number 8. It sets `transition-delay` to `490ms`.

## Block 573 (lines 3785-3787): body.public-site .cookie-accept

```css
body.public-site .cookie-accept {
  background: var(--green-600);
}
```

This rule points to bodythings with class `public-site` things with class `cookie-accept`. It paints the background with `var(--green-600)`.

## Block 574 (lines 3789-3791): body.public-site .cookie-reject

```css
body.public-site .cookie-reject {
  border-color: var(--line);
}
```

This rule points to bodythings with class `public-site` things with class `cookie-reject`. It sets `border-color` to `var(--line)`.

## Block 575 (lines 3793-3798): .lf, .pol, .sheet, .sp

```css
.lf,
.pol,
.sheet,
.sp {
  overscroll-behavior: contain;
}
```

This rule points to things with class `lf` and  things with class `pol` and  things with class `sheet` and  things with class `sp`. It sets `overscroll-behavior` to `contain`.

## Block 576 (lines 3800-3802): .sp

```css
.sp {
  border-radius: 20px;
}
```

This rule points to things with class `sp`. It rounds corners to `20px`.

## Block 577 (lines 3804-3810): .x, .mh, .category-card, .section-link, .back-to-top

```css
.x,
.mh,
.category-card,
.section-link,
.back-to-top {
  -webkit-tap-highlight-color: transparent;
}
```

This rule points to things with class `x` and  things with class `mh` and  things with class `category-card` and  things with class `section-link` and  things with class `back-to-top`. It sets `-webkit-tap-highlight-color` to `transparent`.

## Block 578 (lines 3812-3814): .mobile-tabs

```css
.mobile-tabs {
  display: none;
}
```

This rule points to things with class `mobile-tabs`. It hides it.

## Block 579 (lines 3816-3828): @media (min-width: 640px)

```css
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  #sv {
    display: grid;
  }

  .links-btn {
    display: inline-flex;
  }
}
```

This block only runs when `(min-width: 640px)` is true. Inside it, the file changes `.grid`, `#sv`, `.links-btn`.

## Block 580 (lines 3830-3885): @media (min-width: 900px)

```css
@media (min-width: 900px) {
  nav .w {
    height: 78px;
  }

  .hero {
    min-height: 610px;
    padding: 130px 0 130px;
    background:
      linear-gradient(90deg, rgba(23, 22, 20, 0.84) 0%, rgba(23, 22, 20, 0.62) 42%, rgba(23, 22, 20, 0.14) 100%),
      linear-gradient(rgba(23, 22, 20, 0.12), rgba(23, 22, 20, 0.2)),
      var(--img) center 52% / cover no-repeat var(--green-900);
  }

  .hero h1 {
    font-size: clamp(3.25rem, 5vw, 4rem);
    letter-spacing: -0.04em;
  }

  .search {
    grid-template-columns: repeat(5, minmax(0, 1fr)) auto;
    align-items: end;
    margin-top: -58px;
    border-radius: 20px;
    padding: 18px;
    gap: 12px;
  }

  .f {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .f select,
  .f input {
    height: 48px;
    padding: 0 10px;
    border: 1px solid var(--line);
    background-color: var(--bg);
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .card:hover {
    border-color: #c6ded0;
  }

  .card:hover .pic > img {
    transform: scale(1.03);
  }
}
```

This block only runs when `(min-width: 900px)` is true. Inside it, the file changes `nav .w`, `.hero`, `.hero h1`, `.search`, `.f`, and more.

## Block 581 (lines 3887-3891): @media (min-width: 1200px)

```css
@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

This block only runs when `(min-width: 1200px)` is true. Inside it, the file changes `.grid`.

## Block 582 (lines 3893-3937): @media (max-width: 899px)

```css
@media (max-width: 899px) {
  body.public-site nav .w {
    height: 68px;
  }

  .links.open {
    top: calc(68px + env(safe-area-inset-top, 0px));
    right: 16px;
    left: 16px;
    gap: 0;
    padding: 8px 16px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--card);
    box-shadow: 0 12px 32px rgba(23, 22, 20, 0.15);
    color: var(--ink);
  }

  .links.open a {
    min-height: 48px;
    padding: 12px 0;
    border-bottom: 1px solid var(--line);
  }

  .links.open a:last-child {
    border-bottom: 0;
  }

  .ib.m {
    display: grid;
  }

  .category-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .audience-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 18px;
  }
}
```

This block only runs when `(max-width: 899px)` is true. Inside it, the file changes `body.public-site nav .w`, `.links.open`, `.links.open a`, `.links.open a:last-child`, `.ib.m`, and more.

## Block 583 (lines 3939-4238): @media (max-width: 639px)

```css
@media (max-width: 639px) {
  .property-details {
    padding-right: 16px;
    padding-left: 16px;
  }

  .property-details .x {
    width: calc(100% + 32px);
    margin-right: -16px;
    margin-left: -16px;
  }

  .property-summary {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .property-summary-image,
  .property-summary-image > img,
  .property-summary-image > svg,
  .property-summary-image > .commercial-placeholder {
    min-height: 190px;
    max-height: 230px;
  }

  .property-contact {
    align-items: stretch;
    flex-direction: column;
  }

  .property-contact-actions {
    width: 100%;
  }

  .property-contact-actions .wa {
    flex: 1;
    justify-content: center;
  }

  html:has(body.public-site) {
    scroll-padding-top: 76px;
    scroll-padding-bottom: 84px;
  }

  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .w,
  body.public-site nav .w {
    width: calc(100% - 32px);
  }

  #sv,
  .links-btn {
    display: none;
  }

  body.public-site {
    padding-bottom: calc(68px + env(safe-area-inset-bottom, 0px));
  }

  .mobile-tabs {
    position: fixed;
    z-index: 18;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-height: 64px;
    padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid var(--line);
    background: var(--card);
  }

  .mobile-tabs a,
  .mobile-tabs button {
    min-width: 0;
    min-height: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
  }

  .mobile-tabs svg {
    width: 20px;
    height: 20px;
  }

  .mobile-tabs a:first-child,
  .mobile-tabs button[aria-pressed="true"] {
    color: var(--green-600);
  }

  .hero {
    min-height: 510px;
    padding: 74px 0 100px;
    background:
      linear-gradient(90deg, rgba(23, 22, 20, 0.8), rgba(23, 22, 20, 0.44)),
      linear-gradient(rgba(23, 22, 20, 0.08), rgba(23, 22, 20, 0.18)),
      var(--img) 58% center / cover no-repeat var(--green-900);
  }

  .hero h1 {
    max-width: 10ch;
    font-size: clamp(2.5rem, 12vw, 3.5rem);
  }

  .search {
    margin-top: -42px;
    padding: 16px;
    border-radius: 18px;
  }

  .search .f {
    min-width: 0;
  }

  .go {
    width: 100%;
  }

  .trust {
    margin-top: 24px;
  }

  .trust .w {
    grid-template-columns: 1fr 1fr;
    gap: 18px 12px;
    padding: 18px 14px;
  }

  .tr i {
    width: 48px;
    height: 48px;
  }

  .tr b {
    font-size: 13px;
  }

  .tr span {
    font-size: 11px;
  }

  .sec {
    padding-top: 42px;
  }

  .head {
    gap: 8px;
  }

  .head h2,
  .marketplace-intro h2 {
    font-size: clamp(1.4rem, 6vw, 1.75rem);
  }

  .category-grid {
    gap: 10px;
  }

  .category-card {
    min-height: 124px;
    gap: 8px;
    padding: 12px;
    scroll-margin-bottom: 84px;
  }

  .category-icon {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
    border-radius: 50%;
  }

  .category-card b {
    font-size: 13px;
  }

  .category-card small {
    font-size: 11px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .feature-card {
    padding: 15px;
  }

  .cta {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 13px;
    margin: 38px 0 42px;
    padding: 20px;
  }

  .cta-icon {
    width: 48px;
    height: 48px;
    flex-basis: 48px;
    border-radius: 14px;
  }

  .cta-copy {
    flex-basis: calc(100% - 64px);
  }

  .cta h2 {
    font-size: 20px;
  }

  .cta p {
    font-size: 14px;
  }

  .cta .btn {
    width: 100%;
    justify-content: center;
  }

  .cta-art {
    display: none;
  }

  footer .w {
    padding-top: 22px;
  }

  .audience-grid {
    gap: 16px 10px;
    padding-bottom: 20px;
  }

  .audience-item {
    align-items: flex-start;
    gap: 8px;
  }

  .audience-item > svg {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
    padding: 7px;
  }

  .audience-item b {
    font-size: 12px;
  }

  .audience-item small {
    font-size: 11px;
  }

  .fg {
    grid-template-columns: 1fr 1fr;
    gap: 20px 12px;
    padding: 20px 0;
  }

  .fg > .logo {
    grid-column: 1 / -1;
  }

  .fb {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .back-to-top {
    right: 16px;
    bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  }

  .cookie-banner {
    bottom: calc(74px + env(safe-area-inset-bottom, 0px));
  }
}
```

This block only runs when `(max-width: 639px)` is true. Inside it, the file changes `.property-details`, `.property-details .x`, `.property-summary`, `.property-summary-image > .commercial-placeholder`, `.property-contact`, and more.

## Block 584 (lines 4240-4258): @media (max-width: 359px)

```css
@media (max-width: 359px) {
  .logo {
    font-size: 18px;
  }

  .logo i {
    width: 36px;
    height: 36px;
  }

  .category-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .category-card small {
    display: none;
  }
}
```

This block only runs when `(max-width: 359px)` is true. Inside it, the file changes `.logo`, `.logo i`, `.category-card`, `.category-card small`.

## Block 585 (lines 4260-4277): @media (prefers-reduced-motion: reduce)

```css
@media (prefers-reduced-motion: reduce) {
  html:has(body.public-site) {
    scroll-behavior: auto;
  }

  body.public-site *,
  body.public-site *::before,
  body.public-site *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  body.public-site [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

This block only runs when `(prefers-reduced-motion: reduce)` is true. Inside it, the file changes `html:has(body.public-site)`, `body.public-site *::after`, `body.public-site [data-reveal]`.

## Block 586 (lines 4279-4284): .why

```css
.why {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  align-items: center;
}
```

This rule points to things with class `why`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `minmax(0, 1fr)`; leaves `28px` between children; lines up children with `align-items: center`.

## Block 587 (lines 4285-4292): .why-media

```css
.why-media {
  position: relative;
  margin: 0;
  min-height: 260px;
  border-radius: 24px;
  overflow: hidden;
  background: var(--green-50);
}
```

This rule points to things with class `why-media`. It uses `relative` positioning so it can be placed very deliberately; adds outside space of `0`; sets `min-height` to `260px`; rounds corners to `24px`; controls spillover with `hidden`; paints the background with `var(--green-50)`.

## Block 588 (lines 4293-4299): .why-media img

```css
.why-media img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 260px;
  object-fit: cover;
}
```

This rule points to things with class `why-media` img. It sets `display` to `block`; sets `width` to `100%`; sets `height` to `100%`; sets `min-height` to `260px`; tells pictures how to fill their box using `cover`.

## Block 589 (lines 4300-4306): .why-media::after

```css
.why-media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(247, 244, 238, 0.85), rgba(247, 244, 238, 0) 45%);
  pointer-events: none;
}
```

This rule points to things with class `why-media`::after. It sets `content` to `""`; uses `absolute` positioning so it can be placed very deliberately; positions it using `inset: 0`; paints the background with `linear-gradient(90deg, rgba(247, 244, 238, 0.85), rgba(247, 244, 238, 0) 45%)`; sets `pointer-events` to `none`.

## Block 590 (lines 4307-4315): .why-media figcaption

```css
.why-media figcaption {
  position: absolute;
  left: 22px;
  bottom: 28px;
  z-index: 1;
  max-width: 130px;
  font: italic 700 clamp(22px, 5vw, 30px) / 1.2 "Segoe Script", "Brush Script MT", cursive;
  color: #9a6a12;
}
```

This rule points to things with class `why-media` figcaption. It uses `absolute` positioning so it can be placed very deliberately; positions it using `left: 22px`; positions it using `bottom: 28px`; gives it layer number `1`, like deciding which paper sits on top; sets `max-width` to `130px`; shapes the text with `font: italic 700 clamp(22px, 5vw, 30px) / 1.2 "Segoe Script", "Brush Script MT", cursive`; sets the text color to `#9a6a12`.

## Block 591 (lines 4316-4320): .why-eyebrow

```css
.why-eyebrow {
  margin: 0 0 14px;
  font-weight: 700;
  color: var(--muted);
}
```

This rule points to things with class `why-eyebrow`. It adds outside space of `0 0 14px`; shapes the text with `font-weight: 700`; sets the text color to `var(--muted)`.

## Block 592 (lines 4321-4325): .why-copy h2

```css
.why-copy h2 {
  margin: 0 0 14px;
  font-size: clamp(24px, 4vw, 32px);
  line-height: 1.2;
}
```

This rule points to things with class `why-copy` h2. It adds outside space of `0 0 14px`; shapes the text with `font-size: clamp(24px, 4vw, 32px)`; shapes the text with `line-height: 1.2`.

## Block 593 (lines 4326-4332): .why-copy > p:not(.why-eyebrow)

```css
.why-copy > p:not(.why-eyebrow) {
  margin: 0;
  max-width: 560px;
  color: var(--muted);
  font-weight: 600;
  line-height: 1.6;
}
```

This rule points to things with class `why-copy`  directly inside  p but not things with class `why-eyebrow`. It adds outside space of `0`; sets `max-width` to `560px`; sets the text color to `var(--muted)`; shapes the text with `font-weight: 600`; shapes the text with `line-height: 1.6`.

## Block 594 (lines 4333-4338): .why-stats

```css
.why-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 0;
  margin: 26px 0 0;
}
```

This rule points to things with class `why-stats`. It turns on **grid**, which lays children out like boxes on graph paper; chooses the grid columns as `repeat(2, minmax(0, 1fr))`; leaves `20px 0` between children; adds outside space of `26px 0 0`.

## Block 595 (lines 4339-4342): .why-stats > div

```css
.why-stats > div {
  padding: 0 16px;
  border-left: 1px solid var(--line);
}
```

This rule points to things with class `why-stats`  directly inside  div. It adds inside breathing room of `0 16px`; sets `border-left` to `1px solid var(--line)`.

## Block 596 (lines 4343-4346): .why-stats > div:nth-child(odd)

```css
.why-stats > div:nth-child(odd) {
  padding-left: 0;
  border-left: 0;
}
```

This rule points to things with class `why-stats`  directly inside  div when it is child number odd. It sets `padding-left` to `0`; sets `border-left` to `0`.

## Block 597 (lines 4347-4350): .why-stats dt

```css
.why-stats dt {
  font-size: 24px;
  font-weight: 800;
}
```

This rule points to things with class `why-stats` dt. It shapes the text with `font-size: 24px`; shapes the text with `font-weight: 800`.

## Block 598 (lines 4351-4356): .why-stats dd

```css
.why-stats dd {
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--muted);
}
```

This rule points to things with class `why-stats` dd. It adds outside space of `6px 0 0`; shapes the text with `font-size: 14px`; shapes the text with `font-weight: 700`; sets the text color to `var(--muted)`.

## Block 599 (lines 4357-4378): @media (min-width: 900px)

```css
@media (min-width: 900px) {
  .why {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: 56px;
  }
  .why-media,
  .why-media img {
    min-height: 380px;
  }
  .why-stats {
    grid-template-columns: repeat(4, auto);
    justify-content: start;
  }
  .why-stats > div:nth-child(odd) {
    padding-left: 16px;
    border-left: 1px solid var(--line);
  }
  .why-stats > div:first-child {
    padding-left: 0;
    border-left: 0;
  }
}
```

This block only runs when `(min-width: 900px)` is true. Inside it, the file changes `.why`, `.why-media img`, `.why-stats`, `.why-stats > div:nth-child(odd)`, `.why-stats > div:first-child`.

## Block 600 (lines 4380-4380): .why-media

```css
.why-media { max-height: 360px; }
```

This rule points to things with class `why-media`. It sets `max-height` to `360px`.

## Block 601 (lines 4381-4381): @media (min-width: 900px)

```css
@media (min-width: 900px) { .why-media { max-height: 440px; } }
```

This block only runs when `(min-width: 900px) { .why-media { max-height: 440px; } }` is true.

## Block 602 (lines 4383-4389): .logo-img

```css
.logo-img {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  object-fit: cover;
}
```

This rule points to things with class `logo-img`. It sets `flex` to `none`; sets `width` to `40px`; sets `height` to `40px`; rounds corners to `12px`; tells pictures how to fill their box using `cover`.

## Block 603 (lines 4391-4399): /* Touch-friendly targets for small text links */ .fg a, .fb a, .location-cre...

```css
/* Touch-friendly targets for small text links */
.fg a,
.fb a,
.location-credit a,
#cookie-settings {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

This rule points to /* Touch-friendly targets for small text links */ things with class `fg` a and  things with class `fb` a and  things with class `location-credit` a and  the one with id `cookie-settings`. It sets `min-height` to `44px`; sets `display` to `inline-flex`; lines up children with `align-items: center`.

## Block 604 (lines 4400-4402): .fg a

```css
.fg a {
  display: flex;
}
```

This rule points to things with class `fg` a. It turns on **flexbox**, which lines children up like toys in a row or column.

## Block 605 (lines 4404-4412): /* Skip rendering work for sections far below the fold */ #categories, #shops...

```css
/* Skip rendering work for sections far below the fold */
#categories,
#shops-spaces,
#how,
#listroom,
footer {
  content-visibility: auto;
  contain-intrinsic-size: auto 640px;
}
```

This rule points to /* Skip rendering work for sections far below the fold */ the one with id `categories` and  the one with id `shops-spaces` and  the one with id `how` and  the one with id `listroom` and  footer. It sets `content-visibility` to `auto`; sets `contain-intrinsic-size` to `auto 640px`.


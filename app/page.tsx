import Link from "next/link";
import { CookieConsent } from "@/app/components/cookie-consent";
import { getPublicSupabase } from "@/lib/supabase/public";
import { availabilityLabel, moneyFromPesewas, type PublicListing } from "@/lib/listings";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const listingColumns = "id,title,description,room_type,rent_amount_pesewas,rent_period,town,area,facilities,last_confirmed_at,photo_paths";

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

async function getListings(params: Record<string, string | string[] | undefined>) {
  const client = getPublicSupabase();
  if (!client) return { listings: [] as PublicListing[], error: "Room listings are not connected yet. Please try again later." };

  let query = client.from("public_listings")
    .select(listingColumns)
    .order("created_at", { ascending: false })
    .range(0, 23);
  const town = one(params.town).trim();
  const area = one(params.area).trim();
  const roomType = one(params.room_type).trim();
  const budget = Number(one(params.budget));
  if (town) query = query.eq("town", town);
  if (area) query = query.eq("area", area);
  if (roomType) query = query.eq("room_type", roomType);
  if (Number.isSafeInteger(budget) && budget > 0) query = query.lte("rent_amount_pesewas", budget * 100);

  const { data, error } = await query;
  if (error) {
    console.error("public_listings_query_failed", { code: error.code });
    return { listings: [] as PublicListing[], error: "We could not load rooms right now. Please try again later." };
  }
  return { listings: (data || []) as PublicListing[], error: "" };
}

function ListingCard({ listing }: { listing: PublicListing }) {
  const imagePath = listing.photo_paths.find((path) => path.startsWith("/api/listings/"));
  return (
    <article className="card">
      <div className="pic">
        {imagePath
          ? <img className="listing-card-image" src={imagePath} alt={`Photo of ${listing.title}`} loading="lazy" />
          : <div className="listing-unavailable">Property photos</div>}
        <span className="ty">{listing.room_type}</span>
      </div>
      <div className="b">
        <h3 className="listing-title">{listing.title}</h3>
        <div className="loc">{listing.area}, {listing.town}</div>
        <div className="fac">{listing.facilities.slice(0, 6).map((facility) => <span key={facility}>{facility}</span>)}</div>
        <div className="meta">{availabilityLabel(listing.last_confirmed_at)}</div>
        <div className="ft">
          <div className="pr">{moneyFromPesewas(listing.rent_amount_pesewas)} <small>/{listing.rent_period.toLowerCase()}</small></div>
          <div className="acts"><a className="wa" href={`/api/listings/${encodeURIComponent(listing.id)}/contact`}>Contact owner</a></div>
        </div>
      </div>
    </article>
  );
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { listings, error } = await getListings(params);
  return (
    <>
      <nav>
        <div className="w">
          <Link className="logo" href="/" aria-label="NestGH home">
            <span aria-hidden="true">⌂</span><span>NestGH<small>FIND · LIST · RENT</small></span>
          </Link>
          <div className="links">
            <Link href="/">Home</Link><a href="#rooms">Rooms</a><a href="#how">How it works</a><Link href="/list-room">List your room</Link>
          </div>
          <div className="nr"><Link className="btn gold links-btn" href="/list-room">List a room</Link></div>
        </div>
      </nav>
      <header className="hero">
        <div className="w">
          <p className="eyebrow">Verified rooms. Better living.</p>
          <h1>Find Your Next Room</h1>
          <div className="script">with NestGH</div>
          <p className="d">Search by town and area. Clear prices in GH₵, current availability, and direct contact.</p>
        </div>
      </header>
      <div className="w">
        <form className="search" action="/" method="get" aria-label="Search rooms">
          <div className="f"><label htmlFor="town">Town</label><input id="town" name="town" maxLength={80} defaultValue={one(params.town)} /></div>
          <div className="f"><label htmlFor="area">Area</label><input id="area" name="area" maxLength={80} defaultValue={one(params.area)} /></div>
          <div className="f"><label htmlFor="room_type">Room type</label>
            <select id="room_type" name="room_type" defaultValue={one(params.room_type)}>
              <option value="">Any</option><option>Single Room</option><option>Chamber &amp; Hall</option><option>Self-Contained</option><option>Student Hostel</option>
            </select>
          </div>
          <div className="f"><label htmlFor="budget">Monthly budget (GH₵)</label><input id="budget" name="budget" type="number" min={1} max={1000000} step={1} defaultValue={one(params.budget)} /></div>
          <button className="go" type="submit">Search</button>
        </form>
      </div>
      <section className="trust"><div className="w">
        <div className="tr"><b>Reviewed listings</b><span>Checked before going live</span></div>
        <div className="tr"><b>Direct contact</b><span>Reach the owner directly</span></div>
        <div className="tr"><b>No seeker account</b><span>Search without signing up</span></div>
        <div className="tr"><b>Availability dates</b><span>See when a room was confirmed</span></div>
      </div></section>
      <main>
        <section className="sec search-results" id="rooms"><div className="w">
          <div className="head"><div><p className="eyebrow">Rooms in Ghana</p><h2>Available rooms</h2></div></div>
          {error ? <p className="status-banner" data-kind="error" role="status">{error}</p> : null}
          <div className="grid">
            {listings.map((listing) => <ListingCard listing={listing} key={listing.id} />)}
            {!error && !listings.length ? <div className="empty"><b>No approved rooms found.</b><p>Try another search or check back soon.</p></div> : null}
          </div>
        </div></section>
        <section className="sec" id="how"><div className="w why">
          <div className="wimg" role="img" aria-label="A welcoming home interior"><span>Rooms you can trust</span></div>
          <div><p className="eyebrow">Why NestGH</p><h2>More than listings.<br />Rooms you can check.</h2>
            <p>Listings are reviewed before they go live and show when availability was last confirmed. Never pay before you have seen the room.</p>
          </div>
        </div></section>
        <div className="w"><section className="cta"><h2>Got a room to rent out?</h2><p>Owner submissions and secure listing payments are being prepared for staging.</p><Link className="btn gold" href="/list-room">List your room</Link></section></div>
      </main>
      <footer><div className="w fg">
        <div className="logo"><span>NestGH<small>FIND · LIST · RENT</small></span></div>
        <div><h4>Quick links</h4><div className="footer-links"><Link href="/">Home</Link><a href="#rooms">Rooms</a><Link href="/list-room">List your room</Link><Link href="/privacy">Privacy</Link><CookieConsent /></div></div>
      </div></footer>
    </>
  );
}

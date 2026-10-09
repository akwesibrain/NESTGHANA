# Frontend listing data contract

All fields below are optional additions to a room listing's existing `public_data`. A listing without them must continue to render. Dates use ISO 8601 strings. Prices are Ghana cedis, matching the existing listing price fields. The UI must display a claim only when its corresponding value explicitly supports it; missing values are not `false`, confirmed, or verified.

## Phase 1: availability and trust

| Field | Type | Meaning |
|---|---|---|
| `availabilityStatus` | `"Available" \| "Almost taken" \| "Reserved" \| "Rented" \| "Unavailable"` | Explicit current availability. Do not infer this from the listing's age or confirmation date. The existing top-level unavailable status continues to mean `Unavailable`. |
| `lastVerifiedAt` | `string` (ISO 8601 date or datetime) | Date NestGH last verified the listing. This is distinct from the existing `confirmed_at`, which records an availability confirmation. Omit when no verification date exists. |
| `verifications` | `object` | Explicit record of completed checks. Each optional boolean is shown only when `true`. |
| `verifications.property` | `boolean` | NestGH checked the property. |
| `verifications.price` | `boolean` | NestGH checked the listed price. |
| `verifications.availability` | `boolean` | NestGH checked the property's availability. |
| `verifications.ownerIdentity` | `boolean` | NestGH checked the owner's identity. |
| `verifications.visitedByNestGH` | `{ date: string }` | NestGH visited the property on the supplied date. Omit when there is no recorded visit. |
| `contactType` | `"Direct Owner" \| "Verified Agent" \| "Verified Property Manager" \| "Caretaker"` | The listing contact's stated, explicitly confirmed relationship to the property. The two `Verified` values must only be supplied after the corresponding check. |

## Phase 2: costs, living details, and media

`CostLine` means `{ amount: number; certainty: "estimated" | "confirmed" }`. Amounts are non-negative Ghana cedi values. A zero viewing fee is represented as `{ amount: 0, certainty: "confirmed" }`; absence of a fee value does not mean there is no fee.

| Field | Type | Meaning |
|---|---|---|
| `rentCertainty` | `"estimated" \| "confirmed"` | Whether the existing rent amount is estimated or confirmed. |
| `costs.advance` | `CostLine & { months: number }` | Advance payment amount and covered months. |
| `costs.deposit` | `CostLine` | Deposit due at move-in. |
| `costs.agencyFee` | `CostLine` | Mandatory agency or caretaker fee. |
| `costs.viewingFee` | `CostLine` | Viewing fee, including an explicitly confirmed zero amount. |
| `costs.serviceCharges` | `CostLine` | Mandatory move-in service charges. |
| `costs.otherMandatoryCharges` | `Array<CostLine & { label: string }>` | Other mandatory move-in charges; each supplied charge must be shown. |
| `costs.monthly.electricity` | `CostLine` | Estimated or confirmed recurring electricity cost. |
| `costs.monthly.water` | `CostLine` | Estimated or confirmed recurring water cost. |
| `costs.monthly.internet` | `CostLine` | Estimated or confirmed recurring internet cost. |
| `costs.monthly.other` | `Array<CostLine & { label: string }>` | Other recurring monthly costs. |
| `included` | `string[]` | Items or services stated to be included in the rent. |
| `excluded` | `string[]` | Items or services stated to be excluded from the rent. |
| `livingDetails.waterSource` | `string` | Stated water source. |
| `livingDetails.electricityType` | `string` | Stated electricity arrangement, such as prepaid or shared meter. |
| `livingDetails.backupPower` | `string` | Stated backup power details. |
| `livingDetails.bathroom` | `string` | Whether the bathroom is private or shared, or other stated details. |
| `livingDetails.kitchen` | `string` | Whether the kitchen is private or shared, or other stated details. |
| `livingDetails.security` | `string` | Security details supplied for the property; not a safety rating. |
| `livingDetails.curfew` | `string` | Stated curfew rules. |
| `livingDetails.visitorRules` | `string` | Stated visitor rules. |
| `livingDetails.landlordLivesOnPremises` | `boolean` | Whether the landlord lives on the premises. `false` is a supplied “No”; missing is unknown. |
| `whatWeChecked` | `string[]` | Specific property checks actually completed by NestGH. |
| `photoDetails` | `Array<{ category?: "room" \| "bathroom" \| "kitchen" \| "compound" \| "exterior"; takenAt?: string }>` | Optional metadata for photos, in the same order as the existing `photos` array. Only show dates or categories that are supplied. |
| `walkthroughVideo` | `{ src: string; poster: string }` | Direct video file and poster image for native HTML video playback; not a third-party player or service. |

## Phase 3: search and location

| Field | Type | Meaning |
|---|---|---|
| `searchDetails.water` | `boolean` | Whether water is available at the property. |
| `searchDetails.electricity` | `boolean` | Whether electricity is available at the property. |
| `searchDetails.security` | `boolean` | Whether the listed security feature is present; not a safety rating. |
| `searchDetails.kitchen` | `boolean` | Whether a kitchen is available. |
| `searchDetails.bathroom` | `boolean` | Whether a bathroom is available. |
| `searchDetails.furnished` | `boolean` | Whether the property is furnished. |
| `searchDetails.studentFriendly` | `boolean` | Whether the property is explicitly marked student-friendly. |
| `searchDetails.landmark` | `string` | Supplied nearby landmark. |
| `campusDistances` | `Array<{ institution: string; campus: string; walkingMinutes?: number; distanceKm?: number }>` | Manually supplied campus proximity; never derive it from a map or distance service. |

Area aliases and nearby-area suggestions are maintained in static frontend data, not listing records. Unknown search values must not be treated as a match.

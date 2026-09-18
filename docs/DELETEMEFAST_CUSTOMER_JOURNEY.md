# DeleteMeFast customer journey: three questionnaires + one private table

This document records the customer-facing journey added to the DeleteMeFast surface.

## 1. Soft questionnaire — before profile creation

Purpose: understand why the person arrived without immediately asking for intimate or sensitive details.

Collect only broad intent:
- reason for arrival
- desired outcome
- urgency
- whether anything has already been attempted

The customer then enters profile setup.

## 2. Intimate client questionnaire — before dashboard seating

Purpose: understand the client and the situation rather than immediately asking for identifiers.

Collect:
- what happened
- who/what is affected
- privacy, safety, work, family, financial, reputation, or account concerns
- desired outcome
- contextual information needed to personalize the workspace

## 3. Identity verification gate

Sensitive evidence searching is not unlocked by a checkbox, URL, role string, or browser state.

Production implementation must receive a real verification result from an identity provider and retain:
- verification reference
- verification status
- verified-at timestamp
- scope/purpose
- provider provenance

## 4. Intimate evidence questionnaire — after identity verification

Purpose: identify the exact identifiers the customer authorizes DeleteMeFast to investigate.

Supported identifier classes:
- names and previous names
- current and previous addresses
- phone numbers
- email addresses
- usernames
- aliases
- domains/websites
- organizations/employers
- platforms/profiles

The customer chooses what to investigate and what matters most.

The search layer must not manufacture findings. A future provider adapter should return actual observations with source, URL/reference, observed identifier, observation time, provenance, and an explicit basis for any statement that a source sells or shares information.

The FTC notes that people-search sites can compile information from data brokers, public social profiles, and public records and may sell reports containing details such as names, addresses, properties, family members, and employment history. DeleteMeFast should therefore show source-level findings and opt-out/removal paths where legitimate mechanisms exist rather than presenting a single unexplained risk score. See the FTC consumer guidance: https://consumer.ftc.gov/articles/what-know-about-people-search-sites-sell-your-information

## The private table is the ticket

Every personalized customer workspace is created around a unique DeleteMeFast case/ticket ID.

The dashboard is not a decorative profile page. It is the customer's view of:
- identity profile
- authorized evidence targets
- verified observations
- exposure map
- threat assessment
- service options
- case/ticket state
- work that has actually happened
- what the customer needs to do next

Billable work remains payment-gated. Payment creates the economic authorization; server approval creates the work authorization; only then can bounded ticket work begin.

No fake search results, fake threats, fake counts, fake payments, or fake service completion states are rendered.

## 5. Paid instant IP lookup

The private table also offers an IP address lookup service after payment/entitlement. The customer can enter a public IPv4 or IPv6 address and receive provider-backed general network and geographic information such as country, region, city where available, postal area where available, timezone, ISP/organization, network, anonymizer indicators, and an accuracy radius where supported.

The UI must describe this as approximate GeoIP information. It must never represent an IP result as a person's street address, household, or exact physical location. MaxMind explicitly states that IP geolocation cannot reliably identify a specific household, individual, or street address and recommends displaying an accuracy radius for coordinates. citeturn0search0turn0search1

Payment unlocks the entitlement; the actual lookup must call a configured provider adapter. No fake IP results are rendered and no lookup occurs before entitlement is verified.

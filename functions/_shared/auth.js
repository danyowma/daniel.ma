// Cloudflare Access sits in front of every /budget/* route (configured in
// the Zero Trust dashboard, not in this repo — see README) and injects the
// verified viewer's email on every request it lets through. We trust that
// header rather than doing any auth of our own; if it's missing, either
// Access isn't configured for this route or we're being hit directly,
// neither of which should be allowed to write data.
export function getUserEmail(request) {
  var email = request.headers.get("Cf-Access-Authenticated-User-Email");
  if (!email) {
    throw new AuthError("missing Cf-Access-Authenticated-User-Email header — request did not come through Cloudflare Access");
  }
  return email;
}

export class AuthError extends Error {}

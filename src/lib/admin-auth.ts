export function isAuthorized(request: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "fwf2026";
  return request.headers.get("x-admin-key") === expected;
}

import { createSerializer, parseAsString } from "nuqs";

export const RETURN_TO_QUERY_KEY = "returnTo";

export const serializeReturnToSearchParams = createSerializer({
  [RETURN_TO_QUERY_KEY]: parseAsString,
});

export const getCurrentReturnToPath = (
  pathname: string,
  searchParams: URLSearchParams,
) => {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
};

export const getSafeReturnToPath = (returnTo: string | null) => {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }

  if (returnTo.includes("/watch")) {
    return "/";
  }

  return returnTo;
};

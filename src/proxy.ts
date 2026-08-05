import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // opengraph-image/twitter-image — metadata-роути з локальним префіксом,
  // редірект as-needed зламав би їхні URL з мета-тегів
  matcher:
    "/((?!api|trpc|_next|_vercel|.*opengraph-image.*|.*twitter-image.*|.*\\..*).*)",
};

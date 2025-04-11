import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("/about", "routes/about.tsx"),
    route("/contact", "routes/contact.tsx"),
    route("/register", "routes/register.tsx"),
    route("/login", "routes/login.tsx"),
    route("/logout", "routes/logout.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/new", "routes/new-video.tsx"),
    route("/watch/:videoId", "routes/watch-video.tsx"),
    route("/review/:videoId", "routes/review-video.tsx"),
  ]),
] satisfies RouteConfig;

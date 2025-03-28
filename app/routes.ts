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
    route("/register", "routes/register.tsx"),
    route("/login", "routes/login.tsx"),
    route("/new", "routes/new-video.tsx"),
    route("/review/:videoId", "routes/new-review.tsx"),
    route("/:slug", "routes/video-details.tsx"),
    // TODO: /:slug/review
  ]),
] satisfies RouteConfig;

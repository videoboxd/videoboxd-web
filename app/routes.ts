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
    route("/dashboard", "routes/dashboard.tsx"),
    route("/new", "routes/new-video.tsx"),
    route("/review/:platformVideoId", "routes/new-review.tsx"),
    route("/:platformVideoId", "routes/video-details.tsx"),
    // TODO: /:slug/review
  ]),
] satisfies RouteConfig;

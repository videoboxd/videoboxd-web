# Videoboxd Web

**Videoboxd** ....

## 🚀 Features

> TODO: Change these

- 🔍 **Restaurant Search & Discovery** – Find nearby restaurants based on location, cuisine, and user ratings.
- 📖 **Detailed Restaurant Information** – View restaurant details, including menus, pricing, opening hours, and facilities.
- ⭐ **User Reviews & Ratings** – Check real user reviews and leave your own feedback.
- 🗺️ **Interactive Map Navigation** – Locate restaurants on an interactive map for easy directions.
- ❤️ **Personalized Experience** – Save favorite restaurants and get tailored recommendations.
- 👥 **Community Contributions** – Users can add new restaurants and share their experiences.

## List Pages

> TODO: Change these

List all pages in the FeastFind Web application.

- `/` - This route is the home page of the application.
- `/about` - This route is will filled with informartion about the team who
  build this application.
- `/register` - This route is used to register a new account.
- `/login` - This route is used to login to an existing account.
- `/places` - This route is used to list all the places in the application.
- `/places/:slug` - This route is used to view a specific place.
- `/explore` - This route is used to discover a new places.
- `/reviews` - This route is used to discover people latest activity.
- `/dashboard` - This route is used to view the dashboard of the user.
- `/:username` - This route is used to view the profile of the user.
- `/:username/favorites` - This route is used to view the favorites of the user.

## Tech Stack and Dependencies

- Language: TypeScript
- Runtime: Bun
- Framework: React Router v7 Framework
- CSS Framework: Tailwind CSS
- Components Library: Shadcn UI
- Data Validation: Zod
- File Upload: Uploadcare

## Installation or Initialize the project

Setup the environment variables:

```sh
cp .env.example .env
```

Install dependencies:

```sh
bun install
```

Start the development server:

```sh
bun dev
```

Build your app for production:

```sh
bun run build
```

# Census Desk

Census Desk is a web-based progressive web app for collecting individual census records and displaying population summaries by age group, sex, and nationality. The app is designed for individual census work, quick field entry, offline access, and simple reporting without requiring a complex backend workflow.

## Features

- Add individual census records with name, age, sex, nationality, and location or household details.
- View live totals for people counted, unique nationalities, and last update time.
- Analyze records by age group, sex, and nationality using visual summary bars.
- Search collected records by name, sex, nationality, or location.
- Export census records as a CSV file.
- Store records locally in the browser for lightweight offline use.
- Installable PWA experience with manifest, app icons, and service worker caching.
- Responsive interface for desktop, tablet, and mobile screens.

## Tech Stack

- Laravel 12
- PHP 8.2+
- Vite
- Tailwind CSS 4
- Vanilla JavaScript
- Browser `localStorage`
- Progressive Web App APIs

## Requirements

Before running the project, make sure these are installed:

- PHP 8.2 or newer
- Composer
- Node.js and npm
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/Tohkuh/census-app.git
cd census-app
```

Install PHP dependencies:

```bash
composer install
```

Install frontend dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Build the frontend assets:

```bash
npm run build
```

Start the local server:

```bash
php artisan serve
```

Open the app in your browser:

```text
http://127.0.0.1:8000
```

## Development

For active development, run the Vite development server:

```bash
npm run dev
```

In a separate terminal, run Laravel:

```bash
php artisan serve
```

## How It Works

Census Desk currently stores records in the browser using `localStorage`. This makes the app fast and usable offline on the same device. Records remain available after refreshing the page, but they are device-specific unless exported as CSV.

The service worker caches the application shell, manifest, and icons so the app can continue loading after it has been opened once.

## Main Files

- `resources/views/welcome.blade.php` - main application layout
- `resources/css/app.css` - responsive interface styling
- `resources/js/app.js` - census form, summaries, search, export, and PWA registration
- `public/manifest.webmanifest` - PWA metadata
- `public/service-worker.js` - offline cache behavior
- `public/icons/` - app icons

## Testing

Run the Laravel test suite:

```bash
php artisan test
```

Build the frontend for production:

```bash
npm run build
```

## CSV Export

The CSV export includes:

- Name
- Age
- Age group
- Sex
- Nationality
- Location
- Date and time recorded

## Notes

This project is suitable for individual census collection work and demonstrations. For multi-user census operations or centralized reporting, the next step would be adding database-backed records, authentication, and server-side dashboards.

## License

This project is open-source and may be used for learning, demonstration, and development purposes.

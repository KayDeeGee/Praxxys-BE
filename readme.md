# Praxxys BE Exam Project

## Requirements

-   PHP >= 8.1
-   Composer
-   Node.js >= 18
-   NPM
-   MySQL

---

## Installation

-   clone the project
-   cd api (Laravel)
    -   composer install
    -   make db (praxxys-be or rename it on env)
    -   reconfigure env copy
    -   php artisan key:generate
    -   php artisan migrate --seed
    -   php artisan storage:link (for file uploads)
    -   php artisan serve
-   cd frontend (vue)
    -   npm install
    -   npm run dev

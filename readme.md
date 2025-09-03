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
    -   php artisan migrate --seed
    -   php artisan serve
    -   php artisan storage:link (for file uploads)
-   cd frontend (vue)
    -   npm install
    -   npm run dev

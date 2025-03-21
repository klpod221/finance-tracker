<div align="center">
    <h1>--// Finance Tracker //--</h1>
    <img src="https://img.shields.io/github/last-commit/klpod221/finance-tracker?style=for-the-badge&color=ffb4a2&labelColor=201a19">
    <img src="https://img.shields.io/github/stars/klpod221/finance-tracker?style=for-the-badge&color=e6c419&labelColor=1d1b16">
    <img src="https://img.shields.io/github/repo-size/klpod221/finance-tracker?style=for-the-badge&color=a8c7ff&labelColor=1a1b1f">
</div>

## About

This is a simple finance tracker that allows you to keep track of your income and expenses. It is built using Next.js, Ant Design, Supabase database to store the data and Redis to cache the data so you can easily host your app on Vercel for free.

The goal of this project is to provide a simple and easy-to-use finance tracker that can be used by anyone. It is not meant to be a full-fledged finance management tool, but rather a simple way to keep track of your income and expenses.

## Features

- [x] User authentication
- [x] User registration
- [ ] Add, edit, and delete transactions
- [ ] Customizable income and expense categories, tags, colors, and icons
- [ ] Customizable currencies, dates, and timezones
- [ ] Customizable income and expense limits with notifications
- [ ] Customizable savings and investments
- [ ] Group finance tracker
- [ ] Dashboard with charts to visualize your income and expenses
- [ ] API to add transactions (maybe useful for read bank notifications or something)

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Supabase](https://supabase.com/)
- [Redis](https://redis.io/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)

## Host your own

1. Fork this repository
2. Go to [Vercel](https://vercel.com/) and create an account
3. Import your forked repository
4. Add a supabase database on Vercel dashboard Storage tab
5. Goto supabase dashboard/SQL editor and run the SQL script in `database/supabase_migration.sql` and after that run the `database/materialized_view.sql` script
6. Add a redis database on Vercel dashboard Storage tab
7. Set up the environment variables
8. Deploy your app
9. Enjoy!

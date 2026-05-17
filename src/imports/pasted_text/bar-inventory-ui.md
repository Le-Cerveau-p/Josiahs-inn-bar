Design a modern, production-ready responsive web application UI for a Bar Inventory & Sales Management System.
The application will be built with React frontend, Express backend, and SQLite database.
Use a dark theme with elegant purple accents, smooth spacing, glassmorphism cards, clean tables, modern charts, and dashboard-focused layouts.
The design should feel like a premium admin SaaS dashboard similar to Linear, Vercel, Stripe Dashboard, or Supabase.

General Design Style

Light/Dark mode UI

Dark grenn accent color

Smooth rounded corners (16px–24px)

Soft shadows and subtle gradients

Minimal but professional layout

Fully responsive desktop + tablet + mobile

Use modern typography similar to Inter

Add hover states, transitions, loading skeletons, and empty states

Use cards, charts, and clean data tables

Sidebar navigation layout

Top navbar with user profile and notifications

Design should be component-driven and easy to convert into React components


Main Application Structure

The application should have:

Login page

Dashboard

Inventory page

Stocking page

Outing page

Analytics page

Drink Management page

Settings/Admin page



---

1. Login Page

Create a premium centered authentication page.

Features:

App logo and title

Email input

Password input

Login button

Remember me checkbox

Elegant illustration related to inventory/bar management

Dark glassmorphism card

Responsive mobile layout



---

2. Main Dashboard

Design a beautiful admin dashboard overview.

Dashboard should contain:

Top Statistics Cards

Total Drinks in Inventory

Total Sales Today

Monthly Revenue

Low Stock Drinks

Hotel Refreshments Count

B&D Count


Each card should contain:

Icon

Trend percentage

Mini graph/sparkline

Hover animation


Main Charts Section

Include:

Monthly Sales Line Chart

Drink Category Pie Chart

Weekly Outing Bar Chart

Revenue Trend Area Graph


Recent Activities Table

Columns:

Date

Activity Type

Drink Name

Quantity

User

Status


Low Stock Alert Widget

Display drinks with low quantity remaining.

Quick Actions

Buttons:

Add Stock

Record Sales

Add New Drink

Generate Report



---

3. Inventory Page

Create a detailed inventory management interface.

Features:

Search bar

Filter dropdowns

Category tabs

Inventory table


Inventory Table Columns:

Drink Image

Drink Name

Category

Quantity Available

Unit Price

Last Updated

Status

Actions


Actions:

Edit

Delete

View Details


Add:

Color-coded stock indicators

Low stock warning badges

Pagination

Export button


Include:

Inventory detail modal/page showing:

Full drink information

Quantity history

Price history

Stock movement timeline




---

4. Stocking Page

Design a stocking entry form where multiple drinks can be added at once.

Features:

Dynamic multi-row form

Add/remove drink rows

Drink selector dropdown

Quantity input

Date picker

Supplier input

Notes field


UI Requirements:

Modern card layout

Sticky summary sidebar

Real-time inventory update preview

Validation states

Submit success animation


Also include:

Recent stocking history table



---

5. Outing Page

This page records drinks leaving inventory.

Outing Types:

Sales

B&D

Hotel Refreshment


Requirements:

Large segmented selector for outing type

Multi-drink selection form

Quantity fields

Automatic subtotal calculation

Date recorded automatically

Optional notes field


Add:

Sales summary sidebar

Inventory deduction preview

Validation for insufficient stock

Transaction confirmation modal


Display:

Recent outing transactions



---

6. Analytics Page

Design a visually impressive analytics dashboard.

Features:

Filters

Date range picker

Drink type selector

Outing type selector

Monthly/weekly/daily toggle


Analytics Widgets

Total Sales Revenue

Most Sold Drink

Least Sold Drink

Highest B&D Month

Hotel Refreshment Statistics


Charts

Sales over time

Revenue growth

Drink popularity

Inventory movement trends

Outing type comparison


Reports Section

Include:

Export PDF

Export CSV

Generate Report button


Add beautiful chart cards with gradients and modern data visualizations.


---

7. Drink Management Page

Admin page for managing drinks.

Features:

Add new drink modal

Edit drink details

Upload drink image

Set price

Set category

Toggle active/inactive


Table Columns:

Drink Name

Category

Price

Current Quantity

Status

Actions


Include:

Floating “Add Drink” button

Bulk edit functionality



---

8. Settings/Admin Page

Create a modern admin settings interface.

Sections:

Profile settings

User management

Role permissions

Notification settings

Database backup settings

System preferences


Include:

Toggle switches

Security settings

Password change form

Activity logs



---

Navigation Layout

Sidebar items:

Dashboard

Inventory

Stocking

Outing

Analytics

Drink Management

Settings


Sidebar should:

Collapse on mobile

Have active item highlights

Include icons

Use smooth transitions



---

Additional UI Requirements

Use reusable component system

Design clean modals and drawers

Include toast notifications

Add loading states

Include empty state illustrations

Add confirmation dialogs

Design elegant tables with sticky headers

Use realistic mock data for drinks and transactions

Include modern chart libraries styling

Create a polished SaaS-quality user experience



---

Important

Generate:

Full app UI flow

Multiple screens connected together

Component variants

Responsive desktop and mobile versions

Auto-layout enabled

Developer-friendly design system

Consistent spacing and color tokens

Ready-to-convert React component structure
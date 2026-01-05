Kids Meal Subscription Platform - Frontend
A comprehensive web application for managing kids' meal subscriptions in schools. Built with Next.js, TypeScript, and Material-UI, this platform provides separate portals for parents and administrators to manage meal subscriptions, deliveries, and payments.

📋 Table of Contents

Features
Tech Stack
Getting Started
Available Scripts
User Roles
Key Features
Deployment

<!-- ============================================================= -->

✨ Features
Parent Portal

👤 Authentication: Secure login/registration with JWT
👶 Child Management: Add, edit, and manage multiple children profiles
🎫 QR Code Generation: Unique QR code for each child for delivery verification
📅 Subscription Management: Create, pause, resume, and cancel subscriptions
🍽️ Meal Tracking: View today's meal status and upcoming meals
📊 Dashboard: Overview of active subscriptions and delivery history
💳 Payment History: Track all subscription payments

Admin Panel

📊 Dashboard: Real-time statistics and analytics
👥 User Management: View all parents and children
🎫 Subscription Management: Monitor and manage all subscriptions
📋 Menu Management: Create and publish weekly meal menus
🚚 Delivery Management: Mark deliveries as delivered or missed
🔍 QR Scanner: Verify and mark deliveries using QR codes
📈 Reports: Daily meal calculations and delivery statistics

🛠️ Tech Stack

Framework: Next.js 14 (App Router)
Language: Javascript
Styling: Material-UI (MUI) + Tailwind CSS
HTTP Client: Axios
Date Handling: date-fns
QR Code: qrcode.react
Deployment: Vercel

<!-- ============================================== -->

🚀 Getting Started
Prerequisites

Node.js 18.x or higher
npm
Backend API running (see backend README)

Installation

Clone the repository

bash git clone https://github.com/firoz-akhter/kids-meal-zikrabyte-frontend.git
cd kids-meal-zikrabyte-frontend

Install dependencies

bash npm install

Set up environment variables

bash cp .env.example .env.local
Edit .env.local and add your configuration:
env NEXT_PUBLIC_API_URL=http://localhost:3001

<!-- NEXT_PUBLIC_APP_NAME=Kids Meal Subscription
NEXT_PUBLIC_APP_VERSION=1.0.0 -->

Run the development server

bash npm run dev

Open in browser
http://localhost:3001

<!-- ====================================================== -->

👥 User Roles

1. Parent

Register and manage account
Add and manage children profiles
Create and manage subscriptions
View meal delivery status
Download child's QR code
Track payment history

Default Parent Credentials (for testing):
Email: parent@example.com
Password: 123456

2. Admin

View dashboard with statistics
Manage all subscriptions
Create and publish meal menus
Mark deliveries as delivered/missed
Scan QR codes for verification
View reports and analytics

Default Admin Credentials:
Email: admin@kidsmeals.com
Password: Admin@123

<!-- ================================================================ -->

🎯 Key Features
Authentication & Authorization

JWT-based authentication
Role-based access control (Parent/Admin)
Protected routes with automatic redirects

Parent Dashboard-------->

Today's meal status (Pending/Delivered/Missed)
Active subscriptions overview
Quick access to QR codes
Upcoming meals calendar
Recent activity feed

Admin DashBoard-------->

Dashboard Statistics

    Total parents count
    Total children enrolled
    Active subscriptions
    Today's meal requirements
    Delivery completion rate
    Paused/Cancelled subscriptions

Delivery Management

    View today's deliveries
    Mark as Delivered/Missed
    Add delivery comments
    QR code scanning for verification
    Delivery history with filters

Menu Management

    Create weekly menus
    Assign meals to specific days
    Publish/Unpublish menus
    View menu history

🚀 Deployment
Deployed on vercel
url ==> https://kids-meal-zikrabyte-frontend.vercel.app/

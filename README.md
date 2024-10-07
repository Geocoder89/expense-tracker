# Expense Tracker Application

## Table of Contents
- [Overview](#overview)
- [Technologies and Libraries Used](#technologies-and-libraries-used)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Assumptions](#assumptions)
- [Testing Optional Features](#testing-optional-features)


## Overview
This is a simple Expense Tracker application built with React and Redux. Users can add, edit, and delete expenses, categorizing them for better financial tracking. The application utilizes local state management for forms and Redux for global state management of expenses, it is available in both light and dark modes.



## Technologies and Libraries Used
- **React** - A JavaScript library for building user interfaces.
- **Redux** - A predictable state container for JavaScript apps.
- **React Router** - A collection of navigational components that compose declaratively with your application.
- **React Select** - A flexible and beautiful Select input control for React.
- **React DatePicker** - A simple and reusable date picker component for React.
- **TypeScript** - A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS** - A utility-first CSS framework for creating custom designs to make quick,responsive and user friendly interface for the design.

- **Recharts** - An Open source React Library designed to make simple yet user-intuitive and user-friendly charts.

- **React-Icons** - An Open source React Library where icons are readily available to improve the design and friendliness of the interface.

- **Framer Motion** - This was used to cater to basic animations.
- **uuid** - A library for generating unique identifiers.
- **Jest & React-testing-library** - These libraries were used to run unit tests on the Expense Form, Expense List and Expense Summary Components.

## Setup Instructions

To run this application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Geocoder89/expense-tracker.git
   cd personal-expense-tracker

2. **Install Dependencies:**
   ```bash
      node -v
      npm -v

3. **Install the required packages**:
   ```bash
     npm install

4. **Run the application**:
    ```bash
      npm run dev
  Your application should now be running on http://localhost:5173.


## Assumptions

Persistence is handled solely by Local Storage due to ease and to save time since it was essentially a frontend task, the mode either light or dark initially is dependent on your presences but you can switch this using the switch at the top

## Testing Optional Features
Run Tests with Jest using the command below
**Test**:
```bash
npm test








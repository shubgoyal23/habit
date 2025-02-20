# Habit Tracker

Habit Tracker is a full-stack application designed to help users build, maintain, and track their daily habits. With a clean and modern interface and a robust backend, this tool makes it easy to monitor your progress, set reminders, and stay motivated on your self-improvement journey.

## Features

- **Habit Management**: Create, update, and delete habits.
- **Progress Tracking**: Mark daily completions and visualize your streaks.
- **Reminders & Notifications**: Stay on track with timely alerts.
- **Analytics Dashboard**: View detailed statistics to analyze your habit patterns.

## Live Demo

Experience Habit Tracker in action at [habit.proteinslice.com](https://habit.proteinslice.com).
Andriod app [here](https://play.google.com/store/apps/details?id=com.proteinslice.habit)

## Repository Structure

- **backend/**  
  Contains the Node.js backend built with Express. This server handles authentication, data persistence, and business logic.

- **frontend/**  
  Contains the JavaScript-based frontend (built with Reactjs) which provides a responsive and user-friendly interface.

- **worker/**  
  Contains background services (written in Go) responsible for handling asynchronous tasks like sending notifications and processing analytics.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Go](https://golang.org/) (if you plan to work on the worker service)

## Configuration

Each component (backend, frontend, worker) comes with a sample configuration file (e.g., `.env.example`). Make sure to copy these to `.env` and update the values according to your environment settings, such as database URLs, API keys, and any other necessary credentials.

## Contributing

Contributions are always welcome! If you'd like to improve the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear and descriptive messages.
4. Open a pull request with a detailed description of your changes.

For any major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the **MIT License**.

## Contact

For any questions or support, please reach out via GitHub at [shubgoyal23](https://github.com/shubgoyal23).


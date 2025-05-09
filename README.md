# User Management System - Angular 19 Challenge

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat&logo=typescript)
![Angular Material](https://img.shields.io/badge/Angular_Material-19-607D8B?style=flat&logo=angular)

A modern user management system built with Angular 19, showcasing CRUD operations, responsive design, and best practices in Angular development.

🔗 [View Demo](https://crud-users-management.netlify.app)

## 🌟 Features

- **User Management**

  - Create, Read, Update, and Delete users
  - Form validation with reactive forms
  - Real-time filtering and search
  - Responsive table with expandable rows on mobile

- **Modern UI/UX**

  - Material Design components
  - Responsive layout
  - Loading states and animations
  - Success/Error notifications
  - Country autocomplete search

- **Technical Features**
  - Local storage persistence
  - RxJS for state management
  - Signal-based reactivity
  - Lazy loading
  - Component composition

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- pnpm (v8.x or higher)
- Angular CLI (v19.2.3)

```bash
# Install pnpm globally
npm install -g pnpm

# Install Angular CLI globally
pnpm add -g @angular/cli@19.2.3
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/edgarbenitez92/crud-bci-challenge.git
cd crud-bci-challenge
```

2. Install dependencies

```bash
pnpm install
```

3. Start the development server

```bash
pnpm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/         # Reusable components
│   │   ├── dialogs/        # Dialog components
│   │   └── users-table/    # Users table component
│   ├── pages/              # Page components
│   │   └── users/          # Users page
│   ├── services/           # Services
│   │   ├── countries.service.ts
│   │   ├── local-storage.service.ts
│   │   ├── snack-bar.service.ts
│   │   ├── users.service.ts
│   │   └── utils.service.ts
│   └── shared/             # Shared resources
│       ├── animations/     # Animation definitions
│       ├── interfaces/     # TypeScript interfaces
│       └── mock/           # Mock data
└── assets/                 # Static assets
```

## 💡 Key Concepts

### State Management

- Uses RxJS Subjects for cross-component communication
- Implements Angular Signals for reactive state management
- Local storage for data persistence

### Component Architecture

- Smart/Container components (pages)
- Presentational components (reusable UI elements)
- Dialog components for user interactions

### Form Handling

- Reactive Forms with validation
- Custom validators
- Real-time validation feedback
- Country search with autocomplete

## 🔧 Available Scripts

```bash
# Development server
pnpm start

# Production build
pnpm build
```

## 🚀 Deployment

The application is deployed using Netlify's continuous deployment pipeline. Every push to the main branch triggers a new deployment.

### Production Environment

- **URL**: [https://crud-users-management.netlify.app](https://crud-users-management.netlify.app)
- **Status**: [![Netlify Status](https://api.netlify.com/api/v1/badges/ea5edac8-3cbd-45f6-94f4-3098058b2c6d/deploy-status)](https://app.netlify.com/sites/crud-users-management/deploys)

### Deployment Features

- Continuous Deployment from main branch
- Automatic HTTPS/SSL
- Preview deployments for pull requests
- Custom domain configuration
- Global CDN distribution

### Manual Deployment

If you need to deploy manually, you can build the project and deploy the contents of the `dist` folder:

```bash
# Build for production
pnpm build

# The built project will be in the dist/crud-bci-challenge folder
```

## 🌐 External APIs

The application integrates with:

- [REST Countries API](https://restcountries.com/) - For country data and search

## 📱 Responsive Design

The application is fully responsive and provides:

- Desktop-optimized table view
- Mobile-friendly expandable rows
- Adaptive layout for different screen sizes
- Touch-friendly interactions

## 🔒 Security Considerations

- Input sanitization
- Form validation
- Secure local storage handling
- Error boundary implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- Uses Angular Material for UI components
- Implements lazy loading for better performance
- Follows Angular style guide and best practices
- Uses TypeScript strict mode
- Implements proper error handling

## ✨ Best Practices Implemented

- Proper component composition
- Service layer abstraction
- Reactive programming patterns
- Clean code principles
- Consistent error handling
- Comprehensive documentation
- Type safety with TypeScript
- Responsive design patterns
- Performance optimization

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

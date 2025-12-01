# Brotal - Student Complaint Management System

A modern, full-stack complaint management platform designed for educational institutions to streamline student grievance handling with real-time communication and analytics.

## 🌟 Features

### For Students
- **Submit Complaints**: Easy-to-use interface for lodging complaints with category selection and file attachments
- **Track Status**: Real-time updates on complaint resolution progress
- **Live Chat**: Direct communication with administrators
- **Video Calls**: Face-to-face support through integrated video calling
- **Dashboard**: Overview of all submitted complaints and their current status

### For Administrators
- **Complaint Management**: View, filter, and respond to student complaints
- **Category Management**: Organize complaints by customizable categories
- **User Management**: Monitor and manage student accounts
- **Analytics Dashboard**: Comprehensive statistics and insights on complaint trends
- **Live Chat System**: Real-time messaging with students
- **Video Call Support**: Conduct virtual meetings with students

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend (Lovable Cloud)
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust database
- **Row Level Security** - Data protection
- **Real-time Subscriptions** - Live updates
- **Edge Functions** - Serverless logic
- **Authentication** - Secure user management

## 📁 Project Structure

```
brotal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn components
│   │   ├── AdminSidebar.tsx
│   │   ├── StudentSidebar.tsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useComplaints.ts
│   │   ├── useProfile.ts
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── student/        # Student pages
│   │   ├── Landing.tsx
│   │   └── ...
│   ├── integrations/       # Supabase integration
│   │   └── supabase/
│   └── lib/                # Utility functions
├── supabase/               # Backend configuration
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd brotal
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
   - Environment variables are automatically configured via Lovable Cloud
   - No manual `.env` setup required

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

## 🎯 User Roles

### Student
- Submit and track complaints
- Chat with administrators
- Join video calls
- View personal dashboard

### Administrator
- Manage all complaints
- Respond to student inquiries
- Access analytics dashboard
- Manage categories and users
- Conduct video consultations

## 📊 Database Schema

- **profiles** - User information and avatars
- **user_roles** - Role assignments (admin/student)
- **complaints** - Complaint submissions
- **complaint_responses** - Admin responses
- **categories** - Complaint categories
- **video_calls** - Video call sessions
- **call_participants** - Call participant tracking

## 🚢 Deployment

### Via Lovable
1. Open [Lovable Project](https://lovable.dev/projects/1fb7f954-0b47-4bea-905f-6d92c52d5e82)
2. Click **Share → Publish**
3. Your app will be live instantly

### Custom Domain
Connect your own domain via Project → Settings → Domains

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain)

## 🔧 Development Workflow

### Using Lovable (Recommended)
- Visit the [Lovable Project](https://lovable.dev/projects/1fb7f954-0b47-4bea-905f-6d92c52d5e82)
- Make changes via AI prompts
- Changes auto-commit to this repo

### Using Your IDE
- Clone and edit locally
- Push changes to sync with Lovable
- Hot reload for instant feedback

### Using GitHub
- **Direct editing**: Click pencil icon on any file
- **Codespaces**: Launch cloud development environment

## 🎨 Design System

The project uses a comprehensive design system with:
- Semantic color tokens
- HSL color values for theming
- Dark/light mode support
- Responsive breakpoints
- Custom animations

## 🔐 Security

- Row Level Security (RLS) policies on all tables
- Secure authentication with email/password and Google OAuth
- Protected API routes
- File upload validation
- XSS protection

## 📱 Responsive Design

Fully responsive across:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Developer

**Developed by Muhammed Shamil**

## 📄 License

© 2025 Brototype. All rights reserved.

## 📞 Support

For support and inquiries, please refer to the platform's contact channels.

## 🔗 Links

- [Privacy Policy](./src/pages/privacy-policy.tsx)
- [Terms & Conditions](./src/pages/terms-conditions.tsx)
- [Lovable Documentation](https://docs.lovable.dev)

---

Built with ❤️ using [Lovable](https://lovable.dev)
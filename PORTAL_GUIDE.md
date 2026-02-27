# Interior Design Client Portal - Complete Implementation

## Overview
A full-stack luxury interior design client portal built with Next.js 16, Tailwind CSS, Shadcn UI, and TypeScript. The application features role-based access (Client/Designer), project management, design collaboration, and budget tracking.

## Color Palette
- **Primary**: Emerald Green (#2D5A27)
- **Neutral**: Soft Charcoal (#333)
- **Background**: Cream (#F5F5F5)

## Application Structure

### Pages & Features

#### 1. **Login Page** (`/login`)
- Demo account selection
- Two mock users: Client (Sarah Anderson) and Designer (James Mitchell)
- Instant login without password (for demo purposes)
- Beautiful card-based UI with gradient background

#### 2. **Dashboard Layout**
- Responsive sidebar with project navigation
- Top bar with role switcher and edit mode toggle
- Main content area with project-specific data

#### 3. **Project Overview** (`/dashboard/overview`)
- Project name and description
- Progress percentage with visual progress bar
- Key metrics: Sketches count, Budget items, Invoices
- Next meeting date display
- Budget summary cards (Approved & Pending amounts)

#### 4. **Moodboard & Sketches** (`/dashboard/moodboard`)
- Gallery grid of design sketches (3 columns on desktop, responsive)
- Click to view sketch details and comments
- Designer edit mode: Upload new sketches
- Comment system for client feedback
- Mock images from Unsplash

#### 5. **Budget & Approvals** (`/dashboard/budget`)
- Professional data table with budget items
- Status badges: Pending, Approved, Rejected
- Item details: Name, Category, Cost, Notes
- Designer controls (Edit Mode):
  - Add new budget items
  - Approve/Reject individual items
  - Approve all pending items
- Budget summary showing approved vs pending totals

#### 6. **Invoices** (`/dashboard/invoices`)
- Invoice list with details: Number, Date, Amount, Status
- Status indicators: Paid, Pending, Overdue
- Download PDF buttons (mock functionality)
- Financial summary cards
- Total amount, paid amount, outstanding amount

### Authentication & Roles

#### Client Role
- View-only access to all content
- Can view projects, sketches, budget items, and invoices
- Can comment on sketches
- Cannot modify or approve items

#### Designer Role
- All client permissions plus:
- Edit Mode toggle in top bar
- When in Edit Mode:
  - Upload new sketches to moodboard
  - Add new budget items
  - Approve/Reject budget items
  - Approve all pending items
- Role switcher allows quick testing between client and designer

### Data Structure

All data is managed through `/lib/mockData.ts` with the following structure:

```typescript
// Users
- Client: sarah@example.com (Sarah Anderson)
- Designer: james@designstudio.com (James Mitchell)

// Projects
- Penthouse Renovation (proj_1)

// Linked Data by ProjectId
- Sketches (with comments)
- Budget Items (with status tracking)
- Invoices (with payment status)
```

## Key Features

### 1. **Designer Upload/Edit Workflow**
1. Log in as Designer
2. Click "Edit Mode" button in top bar
3. Navigate to Moodboard → Click "Upload Sketch"
4. Fill in sketch details and provide image URL
5. Navigate to Budget → Click "Add Item" to add budget items
6. Use "Approve All" or individual approve buttons

### 2. **Client Review Workflow**
1. Log in as Client
2. View all project information in read-only mode
3. Comment on sketches in Moodboard
4. Track project progress and budget status
5. Download invoices

### 3. **Demo Role Switching**
- Click "Switch Role" button in top bar
- Instantly switch between Client and Designer accounts
- See different UI controls based on role

## Technical Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with design tokens
- **Components**: Shadcn/ui with custom theming
- **Icons**: Lucide React
- **Type Safety**: TypeScript
- **State Management**: React Context API
- **Date Handling**: date-fns

## Component Architecture

### Layout Components
- `Sidebar.tsx` - Navigation menu with user info
- `TopBar.tsx` - Project title, role switcher, edit mode toggle

### Designer Modals
- `UploadSketchModal.tsx` - Sketch upload form with preview
- `AddBudgetModal.tsx` - Budget item form with category selector

### Page Components
- Moodboard with image gallery and modal
- Budget table with inline actions
- Invoices list with status indicators
- Overview with stats and progress tracking

## Future Enhanbase

### Database Integration (Supabase)
The mock data structure is designed for easy Supabase migration:
- Replace `mockData.ts` with Supabase queries
- Implement Row Level Security (RLS) for role-based access
- Store sketch images in Supabase Storage
- Add real invoice PDF generation

### File Upload
- Replace image URL input with actual file uploads
- Integrate with Vercel Blob or Supabase Storage
- Real PDF invoice downloads

### Real-time Features
- WebSocket integration for live collaboration
- Real-time comment notifications
- Live budget updates

### Additional Features
- Email notifications for status changes
- Invoice payment tracking
- Design revision history
- Timeline/milestones
- Client approval workflows

## Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit http://localhost:3000 to access the portal.

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| sarah@example.com | N/A | Client |
| james@designstudio.com | N/A | Designer |

Just click the account to login (no password required in demo).

## Color Token Reference

### Light Mode
- Background: Cream (#F5F5F5)
- Foreground: Charcoal (#333)
- Primary: Emerald Green (#2D5A27)
- Secondary: Light Gray
- Border: Light Gray (#E8E8E8)

### Dark Mode
- Background: Deep Charcoal
- Foreground: Cream
- Primary: Brighter Emerald
- Secondary: Light Gray
- Border: Dark Gray

## Responsive Design

- **Mobile**: Sidebar hidden, hamburger menu (ready for implementation)
- **Tablet**: Full sidebar visible, stacked grid layouts
- **Desktop**: Full layout with 3-column grids where applicable

## Notes for Production

1. **Authentication**: Replace mock auth with Auth.js or similar
2. **Database**: Migrate to Supabase with RLS policies
3. **File Storage**: Implement real file uploads with virus scanning
4. **API**: Add proper API endpoints for CRUD operations
5. **Security**: Add CSRF protection, rate limiting, input validation
6. **Monitoring**: Set up error tracking and performance monitoring

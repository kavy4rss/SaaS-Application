# Quick Start Guide - Interior Design Portal

## Getting Started

### 1. Access the Application
Navigate to `http://localhost:3000` in your browser.

### 2. Login
Click on either demo account to login:
- **Client Account**: Sarah Anderson (View-only access)
- **Designer Account**: James Mitchell (Full edit access)

## Dashboard Overview

Once logged in, you'll see:
- **Sidebar** (left): Navigation menu and user info
- **Top Bar** (top): Project title, role switcher, and edit mode toggle
- **Main Content**: Project information and features

## Features to Explore

### As a Client
1. **Project Overview** - View project progress and budget summary
2. **Moodboard** - See design sketches and leave comments
3. **Budget** - Review proposed items and their approval status
4. **Invoices** - Download project invoices

### As a Designer
1. Switch to Designer account using the role switcher
2. Click **Edit Mode** button in the top bar (button will change appearance)
3. Now you can:
   - **Upload Sketches**: Go to Moodboard → "Upload Sketch" button
   - **Add Budget Items**: Go to Budget → "Add Item" button
   - **Approve Items**: Approve individual items or click "Approve All"

## Key Workflows

### Upload a New Sketch (Designer)
1. Click Edit Mode (top right)
2. Navigate to Moodboard & Sketches
3. Click "Upload Sketch" button
4. Fill in:
   - Sketch Title
   - Description
   - Image URL (use any valid image URL, e.g., from Unsplash)
5. Preview appears as you enter the URL
6. Click "Upload Sketch" to add to the moodboard

### Add a Budget Item (Designer)
1. Click Edit Mode (top right)
2. Navigate to Budget & Approvals
3. Click "Add Item" button
4. Fill in:
   - Item Name
   - Category (select from dropdown)
   - Cost ($)
   - Notes (optional)
5. Click "Add Item" to add to budget table
6. Use Approve/Reject buttons to manage status

### Approve All Budget Items (Designer)
1. In Edit Mode on Budget page
2. Click "Approve All" button (top right of budget table)
3. All "Pending" items instantly become "Approved"

### Leave a Comment (Client)
1. Go to Moodboard & Sketches
2. Click on any sketch image to open it
3. Scroll to comments section
4. Type your comment and press Send
5. Comments appear below the sketch

### Switch Roles
1. Click "Switch Role" button (top right, always visible)
2. Instantly switches between Client and Designer
3. UI updates to show appropriate controls
4. Edit Mode resets when switching roles

## Troubleshooting

### Page Not Loading
- Try refreshing the page (Ctrl+R or Cmd+R)
- Hard refresh browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Images Not Showing
- Ensure the image URL is valid and publicly accessible
- Try using images from: unsplash.com, pexels.com, or pixabay.com

### Edit Mode Not Working
- Make sure you're logged in as the Designer
- Check that the Edit Mode button shows the "Edit Mode" state

### Changes Not Persisting
- This is a demo app using mock data
- Changes reset when you refresh the page
- For production, integrate with Supabase

## Mock Data

The application uses realistic data:
- **Project**: Penthouse Renovation
- **Budget Items**: 5 items including marble, furniture, lighting
- **Sketches**: 3 initial design concepts
- **Invoices**: 3 invoices with different payment statuses

## Tips & Tricks

1. **Test Both Roles**: Switch between client and designer to see different UI
2. **Try Image URLs**: Use Unsplash image URLs to see different designs
3. **Add Multiple Items**: Add several sketches and budget items to populate the app
4. **Review Data Structure**: Check `lib/mockData.ts` to understand the data model
5. **Check Status Badges**: Notice how status badges change colors (Pending/Approved/Rejected/Paid/Overdue)

## Design Features

- **Luxury Color Palette**: Emerald Green accents with Charcoal and Cream
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Interactions**: Modals, transitions, and hover effects
- **Professional UI**: Inspired by premium SaaS applications
- **Accessibility**: Semantic HTML and proper contrast ratios

## Next Steps

### To Deploy
1. Connect to GitHub repository
2. Deploy to Vercel with one click
3. Share URL with others

### To Add Real Features
See `PORTAL_GUIDE.md` for information on:
- Database integration (Supabase)
- Authentication (Auth.js)
- File uploads (Vercel Blob)
- Real invoice generation

## Support

For questions or issues:
1. Check the `PORTAL_GUIDE.md` for detailed documentation
2. Review component code in `components/` directory
3. Check data structure in `lib/mockData.ts`
4. Review page implementations in `app/dashboard/`

Enjoy exploring the Interior Design Portal!

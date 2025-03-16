# Suhas Roy Admin Portal

A modern, user-friendly, and visually cohesive Admin Portal for managing the website of renowned Indian artist Suhas Roy.

## Overview

This Admin Portal is designed to provide an efficient and intuitive user experience for managing the artist's website content, including artworks, events, media, and user inquiries. The portal aligns with the main website's aesthetics while providing powerful content management capabilities.

## Technology Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- JSON files for data storage (simulating database interactions)

## Features

### Dashboard

- Overview statistics for artworks, events, inquiries, and media
- Recent inquiries display with quick actions
- Upcoming events display with quick actions
- Quick action buttons for common tasks
- Recent activity log

### Artwork Management

- View all artworks in a grid layout
- Add, edit, and delete artwork entries
- Filter artworks by category, medium, year, and availability
- Sort artworks by various criteria
- Search functionality for quick access

### Event Management

- Manage current and upcoming events
- Add, edit, and delete events
- Filter events by status, date, and category
- Calendar view for better event planning

### Media Management

- Manage publications, news, videos, and photographs
- Upload and organize media content
- Filter and search media items
- Preview media content before publishing

### Inquiry Management

- View and respond to user inquiries
- Mark inquiries as resolved
- Filter inquiries by status, date, and type
- Export inquiry data for record-keeping

### Settings

- Theme customization (light/dark mode)
- Profile management
- Security settings
- Dashboard widget preferences

## Folder Structure

```
admin/
├── css/
│   └── admin-style.css
├── js/
│   └── admin.js
├── data/
│   ├── admin-settings.json
│   ├── dashboard-stats.json
│   └── inquiries.json
├── index.html
├── artworks.html
├── events.html
├── media.html
├── inquiries.html
├── settings.html
└── README.md
```

## Getting Started

1. Navigate to the `/admin` directory
2. Open `index.html` in your web browser
3. Log in with your admin credentials
4. You will be directed to the dashboard

## Usage

### Managing Artworks

1. Navigate to the Artworks page
2. Use the filters to find specific artworks
3. Click on an artwork to view details
4. Use the action buttons to edit or delete artworks
5. Click "Add New Artwork" to create a new artwork entry

### Managing Events

1. Navigate to the Events page
2. Use the tabs to switch between current, upcoming, and past events
3. Click on an event to view details
4. Use the action buttons to edit or delete events
5. Click "Create New Event" to add a new event

### Managing Media

1. Navigate to the Media page
2. Use the tabs to switch between different media types
3. Click on a media item to view details
4. Use the action buttons to edit or delete media items
5. Click "Upload Media" to add new media content

### Managing Inquiries

1. Navigate to the Inquiries page
2. Use the filters to find specific inquiries
3. Click on an inquiry to view details
4. Use the action buttons to mark as resolved or delete inquiries
5. Click "Reply" to respond to an inquiry

### Customizing Settings

1. Navigate to the Settings page
2. Use the tabs to switch between different setting categories
3. Adjust settings according to your preferences
4. Click "Save Settings" to apply changes

## Responsive Design

The Admin Portal is fully responsive and optimized for:
- Desktop (1200px and above)
- Tablet (768px to 1199px)
- Mobile (767px and below)

## Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus indicators for interactive elements

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- This is a front-end implementation using JSON files for data storage
- In a production environment, this would be connected to a back-end API
- All actions are simulated for demonstration purposes

## Future Enhancements

- Integration with a back-end API
- Advanced analytics dashboard
- Bulk actions for content management
- User role management
- Automated backup and restore functionality

## Credits

- Font Awesome for icons
- Google Fonts for typography
- Designed and developed for Suhas Roy's website 
# Patient Management Frontend

A modern Next.js frontend application for managing patient information and medical records. Built with TypeScript, Tailwind CSS, and React Hook Form.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Form Validation**: Robust form validation with Zod and React Hook Form
- **Real-time Updates**: Instant UI updates when data changes
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Cards**: Beautiful patient cards with edit/delete functionality
- **Statistics Dashboard**: Overview of patient demographics

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Performant forms with validation
- **Zod**: TypeScript-first schema validation
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful icons
- **Headless UI**: Accessible UI components

## Prerequisites

- Node.js 18+ 
- npm or yarn
- The Patient Background API server running (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd patient-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env.local
```

4. Configure the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
patient-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── PatientCard.tsx       # Patient display card
│   │   └── PatientForm.tsx       # Add/edit patient form
│   ├── services/
│   │   └── api.ts                # API service layer
│   └── types/
│       └── patient.ts            # TypeScript type definitions
├── public/                       # Static assets
├── package.json
└── README.md
```

## Features Overview

### Patient Management
- **View All Patients**: Grid layout with patient cards
- **Add New Patient**: Comprehensive form with validation
- **Edit Patient**: Update existing patient information
- **Delete Patient**: Remove patients with confirmation
- **Real-time Stats**: Live statistics dashboard

### Form Features
- **Validation**: Client-side validation with Zod schemas
- **Dynamic Fields**: Add/remove medical history, allergies, medications
- **Emergency Contact**: Optional emergency contact information
- **Responsive Design**: Works on all screen sizes

### UI Components
- **Patient Cards**: Beautiful cards with all patient information
- **Statistics Cards**: Overview of patient demographics
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful empty state when no patients exist

## API Integration

The frontend communicates with the Patient Background API:

- **Base URL**: `http://localhost:3000/api`
- **Endpoints**:
  - `GET /patients` - Get all patients
  - `GET /patients/:id` - Get patient by ID
  - `POST /patients` - Create new patient
  - `PUT /patients/:id` - Update patient
  - `DELETE /patients/:id` - Delete patient
  - `GET /health` - Health check

## Development

### Adding New Features

1. **Create Types**: Add new interfaces in `/src/types/`
2. **Update API Service**: Add new methods in `/src/services/api.ts`
3. **Create Components**: Build reusable components in `/src/components/`
4. **Update Pages**: Modify or create new pages in `/src/app/`

### Styling

The project uses Tailwind CSS for styling. Key classes:
- `bg-white` - White background
- `text-gray-900` - Dark text
- `rounded-lg` - Rounded corners
- `shadow-md` - Medium shadow
- `hover:shadow-lg` - Hover effects

### Form Validation

Forms use Zod schemas for validation:
```typescript
const patientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(0).max(150),
  gender: z.enum(['Male', 'Female', 'Other']),
  // ... more fields
});
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3000/api`)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Troubleshooting

### Common Issues

1. **API Connection Error**: Make sure the backend server is running on port 3000
2. **CORS Issues**: The backend has CORS enabled, but check if the API URL is correct
3. **Build Errors**: Run `npm run type-check` to identify TypeScript issues

### Development Tips

- Use the browser's developer tools to debug API calls
- Check the Network tab for failed requests
- Use React Developer Tools for component debugging
- Enable TypeScript strict mode for better type safety

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Test on different screen sizes
5. Update documentation as needed

## License

MIT

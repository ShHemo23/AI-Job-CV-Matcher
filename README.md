# FreelanceZen: AI-Powered Job Matching Platform

FreelanceZen is a modern web application that leverages AI to intelligently match freelance professionals with relevant job opportunities. Users can upload their CV, have it automatically parsed into a professional profile, and instantly receive a curated list of job postings scored for relevance.

![FreelanceZen Screenshot](https://i.postimg.cc/nz1PqcST/Freelance-AIApp-1.png)

## Features

- **Google Authentication**: Secure and easy sign-in/sign-up using Firebase Authentication.
- **AI Resume Parsing**: Upload a CV (PDF or DOCX) and have its content automatically extracted and structured into a user profile using Genkit and Google's Gemini models.
- **Persistent User Profiles**: User profile data is securely stored in Firestore, eliminating the need to re-upload a CV on every visit.
- **AI Job Matching**: Genkit uses the extracted user profile to analyze and score a list of job postings, presenting the most relevant opportunities first.
- **Dynamic Job Board**: View, sort, and filter job matches by relevance, date, or required skills.
- **One-Click Apply**: Apply for jobs directly from the interface. The application status is saved to prevent duplicate applications.
- **Theming**: Switch between light and dark modes for a comfortable user experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend as a Service (BaaS)**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini Models
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (`useState`, `useContext`)

## Architecture

The application follows a standard Next.js App Router structure.

-   `src/app/page.tsx`: The main entry point and primary UI component for the application. It manages state for the entire user workflow.
-   `src/components/`: Contains reusable React components, including UI components from `shadcn/ui` and custom layout components like the `Header`.
-   `src/ai/`: Houses all Genkit-related code.
    -   `src/ai/flows/`: Contains the core AI logic, including `parse-resume-flow.ts` and `job-match-flow.ts`. These server-side flows orchestrate calls to the Gemini LLM.
-   `src/lib/`: Includes utility functions, Firebase configuration (`firebase.ts`), and static data like job postings (`job-data.ts`).
-   `src/context/`: Manages global state, such as user authentication (`AuthContext.tsx`).
-   `public/`: Stores static assets.

## Security & Compliance

-   **Authentication**: User identity is managed by Firebase Authentication, which handles secure sign-in and session management.
-   **Database Rules**: Firestore security rules are defined in `firestore.rules` to ensure users can only read and write their own profile and application data. Unauthorized access is blocked at the database level.
-   **API Keys**: The Google Generative AI API key is stored in an environment variable (`.env.local`) and is only used on the server-side within Genkit flows, never exposed to the client.

## Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm
-   A Firebase project with Authentication (Google Sign-In) and Firestore enabled.
-   A Google AI API key for Gemini.

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and add your Firebase and Google AI credentials.

```plaintext
# .env.local

# Google AI API Key for Genkit
GOOGLE_GENAI_API_KEY="AIza..."

# The public Firebase config object for the client
# Replace with your project's config
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
```

### 4. Update Firebase Config (Client-Side)

Replace the placeholder configuration in `src/lib/firebase.ts` with your project's actual Firebase web app configuration.

### 5. Run the Genkit Developer UI (Optional)

In a separate terminal, run the Genkit development server to inspect flows and traces.

```bash
npm run genkit:watch
```

### 6. Run the Next.js Development Server

In your main terminal, start the web application.

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## Developer Workflow

-   **UI Development**: Modify React components in `src/app/page.tsx` and `src/components/`.
-   **AI Logic**: Edit or create new flows in `src/ai/flows/`. The Genkit dev server (`genkit:watch`) will provide real-time feedback and tracing.
-   **Styling**: Use Tailwind CSS utility classes directly in your components. For theme-level changes, edit `src/app/globals.css`.

## Automated Tests

This project is currently set up for manual testing. To add automated tests, we recommend using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component testing, and [Cypress](https://www.cypress.io/) for end-to-end testing.

## Configuration & Environment Variables

| Variable                                  | Description                                                                     | Location      |
| ----------------------------------------- | ------------------------------------------------------------------------------- | ------------- |
| `GOOGLE_GENAI_API_KEY`                    | Your Google AI API key for accessing Gemini models via Genkit.                  | `.env.local`  |
| `NEXT_PUBLIC_FIREBASE_*`                  | The public Firebase configuration keys for connecting the client app to Firebase. | `.env.local`  |

## CI Guidance

To set up a CI/CD pipeline (e.g., with GitHub Actions), follow these steps:

1.  **Secrets Management**: Store `GOOGLE_GENAI_API_KEY` and your full Firebase config as secrets in your CI provider.
2.  **Build Step**: Create a workflow that runs on push/merge to the `main` branch.
    -   Checkout the code.
    -   Install dependencies (`npm install`).
    -   Create the `.env.local` file from the repository secrets.
    -   Run the build command (`npm run build`).
    -   (Optional) Run linter and tests.
3.  **Deployment**: After a successful build, deploy the `.next` directory to your hosting provider of choice (e.g., Firebase Hosting, Vercel, Netlify).

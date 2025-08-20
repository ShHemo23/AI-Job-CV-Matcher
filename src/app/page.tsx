
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Search, User, Bot } from 'lucide-react';
import Image from 'next/image';
import AdBanner from '@/components/core/AdBanner';
import Header from '@/components/layout/Header'; // Import the new Header component

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Use the new Header component */}

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16 overflow-hidden">
           <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate-textTrackingInExpand">
            Find Your <span className="gradient-text">Perfect</span> Freelance Opportunity
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md sm:max-w-xl md:max-w-2xl mx-auto animate-textFocusIn" style={{ animationDelay: '0.5s' }}>
            Connect with clients, showcase your skills, and discover jobs tailored just for you with the power of AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn" style={{ animationDelay: '1s' }}>
            <Button size="lg" asChild className="button-hover-effect w-full sm:w-auto">
              <Link href="/jobs">Explore Jobs</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="button-hover-effect w-full sm:w-auto">
              <Link href="/profile">Create Profile</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="hover-glow-orange">
            <CardHeader>
               <div className="flex items-center gap-3 mb-2">
                 <User className="w-8 h-8 text-primary" />
                 <CardTitle className="text-xl md:text-2xl">Manage Your Profile</CardTitle>
               </div>
              <CardDescription>Create a stunning profile to attract clients. Showcase your skills, experience, and portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-video relative">
                    <Image src="https://picsum.photos/400/200" data-ai-hint="freelancer profile interface" alt="Profile Management" layout="fill" objectFit="cover" className="rounded-md shadow-md" />
                </div>
            </CardContent>
          </Card>
          <Card className="hover-glow-orange">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                 <Search className="w-8 h-8 text-primary" />
                 <CardTitle className="text-xl md:text-2xl">Discover Opportunities</CardTitle>
              </div>
              <CardDescription>Easily browse and filter job listings to find the perfect match for your expertise.</CardDescription>
            </CardHeader>
             <CardContent>
                <div className="aspect-video relative">
                    <Image src="https://picsum.photos/400/200" data-ai-hint="job search interface" alt="Job Discovery" layout="fill" objectFit="cover" className="rounded-md shadow-md" />
                </div>
            </CardContent>
          </Card>
          <Card className="hover-glow-orange">
            <CardHeader>
               <div className="flex items-center gap-3 mb-2">
                 <Bot className="w-8 h-8 text-primary" />
                 <CardTitle className="text-xl md:text-2xl">AI-Powered Matching</CardTitle>
               </div>
              <CardDescription>Let our intelligent system suggest the most relevant jobs based on your profile and preferences.</CardDescription>
            </CardHeader>
             <CardContent>
                <div className="aspect-video relative">
                     <Image src="https://picsum.photos/400/200" data-ai-hint="AI matching technology" alt="AI Matching" layout="fill" objectFit="cover" className="rounded-md shadow-md" />
                </div>
            </CardContent>
          </Card>
        </section>

        {/* Advertisement Section */}
        <section className="py-8 flex justify-center">
          <AdBanner 
            size="leaderboard" 
            keywords={["business tools", "freelance success"]} 
            title="Boost Your Freelance Career!"
            description="Discover tools and services to help you succeed."
            className="max-w-full md:max-w-4xl" 
          />
        </section>

      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} FreelanceZen. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

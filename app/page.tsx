import {
  Hero,
  Stats,
  Features,
  FeaturedProjects,
  RecentPosts,
  ContactCTA,
} from "@/components/home";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Stats />
      <Features />
      <FeaturedProjects />
      <RecentPosts />
      <ContactCTA />
    </div>
  );
}

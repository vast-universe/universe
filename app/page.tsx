import {
  Hero,
  Stats,
  FeaturedProjects,
  RecentPosts,
  ContactCTA,
} from "@/components/home";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Stats />
      <FeaturedProjects />
      <RecentPosts />
      <ContactCTA />
    </div>
  );
}

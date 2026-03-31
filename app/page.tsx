import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Container from "@/components/Container";
import NowPanel from "@/components/NowPanel";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import BookShowcase from "@/components/BookShowcase";
import SectionHeading from "@/components/SectionHeading";
import { fetchProjects } from "@/lib/fetchProjects";
import { fetchMediumPosts } from "@/lib/fetchMedium";
import { getBook } from "@/lib/fetchBook";
import { fetchNow } from "@/lib/fetchNow";

export const revalidate = 60;

export default async function Home() {
  const [projects, posts, nowItems] = await Promise.all([
    fetchProjects(),
    fetchMediumPosts(3),
    fetchNow(),
  ]);
  const book = getBook();

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <main>
      <Navbar />
      <Hero />

      {/* Now Panel */}
      {nowItems.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="mb-10">
              <SectionHeading title="What I'm doing now" />
            </div>
            <NowPanel items={nowItems} />
          </Container>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <SectionHeading
                title="Featured Work"
                subtitle="Selected projects I've built or contributed to."
              />
              <a
                href="/work"
                className="hidden sm:inline-block shrink-0 text-sm text-purple-400 transition-colors hover:text-purple-300"
              >
                View all →
              </a>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <a
              href="/work"
              className="mt-6 inline-block sm:hidden text-sm text-purple-400 transition-colors hover:text-purple-300"
            >
              View all projects →
            </a>
          </Container>
        </section>
      )}

      {/* Blog Preview */}
      {posts.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="mb-10 flex items-end justify-between">
              <SectionHeading
                title="Recent Blogs"
                subtitle="Thoughts on AI, engineering, and building products."
              />
              <a
                href="/blogs"
                className="hidden sm:inline-block shrink-0 text-sm text-purple-400 transition-colors hover:text-purple-300"
              >
                View all →
              </a>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.link} post={post} />
              ))}
            </div>
            <a
              href="/blogs"
              className="mt-6 inline-block sm:hidden text-sm text-purple-400 transition-colors hover:text-purple-300"
            >
              View all blogs →
            </a>
          </Container>
        </section>
      )}

      {/* Book Showcase */}
      <section className="py-20">
        <Container>
          <div className="mb-10">
            <SectionHeading title="The Book" />
          </div>
          <BookShowcase book={book} />
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <Container>
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Nixon Kurian. All rights reserved.
          </p>
        </Container>
      </footer>
    </main>
  );
}

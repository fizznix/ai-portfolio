import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import BlogCard from "@/components/BlogCard";
import SectionHeading from "@/components/SectionHeading";
import { fetchMediumPosts } from "@/lib/fetchMedium";

export const revalidate = 3600;

export default async function BlogsPage() {
  const posts = await fetchMediumPosts(10);

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20">
        <Container>
          <div className="mb-10">
            <SectionHeading
              title="Blogs"
              subtitle="Articles, essays, and notes on AI, engineering, and building."
            />
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.link} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No posts yet. Check back soon.</p>
          )}
        </Container>
      </section>
    </main>
  );
}

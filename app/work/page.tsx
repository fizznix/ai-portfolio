import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { fetchProjects } from "@/lib/fetchProjects";

export const revalidate = 60;

export default async function WorkPage() {
  const projects = await fetchProjects();

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20">
        <Container>
          <div className="mb-10">
            <SectionHeading
              title="All Work"
              subtitle="Every project I've built, contributed to, or shipped."
            />
          </div>
          {projects.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects yet. Check back soon.</p>
          )}
        </Container>
      </section>
    </main>
  );
}

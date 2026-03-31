import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import ChatBox from "@/components/ChatBox";

export const metadata: Metadata = {
  title: "Ask My Portfolio | Nixon Kurian",
  description:
    "Ask questions about Nixon Kurian's projects, blog posts, book, and current work — powered by AI.",
};

export default function AskPage() {
  return (
    <main>
      <Navbar />
      <section className="pb-20 pt-32">
        <Container>
          <div className="mb-10">
            <SectionHeading
              title="Ask My Portfolio"
              subtitle="Chat with an AI that knows about my projects, blogs, book, and what I'm working on."
            />
          </div>
          <ChatBox />
        </Container>
      </section>
    </main>
  );
}

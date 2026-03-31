import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import BookShowcase from "@/components/BookShowcase";
import SectionHeading from "@/components/SectionHeading";
import { getBook } from "@/lib/fetchBook";

export default function BookPage() {
  const book = getBook();

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20">
        <Container>
          <div className="mb-10">
            <SectionHeading title="The Book" />
          </div>
          <BookShowcase book={book} />
        </Container>
      </section>
    </main>
  );
}

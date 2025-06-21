import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Write Smarter with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Notes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed  max-w-md mx-auto">
            Organize, summarize, and understand your notes like never before
            with the power of artificial intelligence.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Writing for Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { Hero } from "@/components/home/Hero";
import { TrendingDestinations } from "@/components/home/TrendingDestinations";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { Container } from "@/components/ui/Container";
import { getAllCountries } from "@/lib/api/server";

export default async function HomePage() {
  const countries = await getAllCountries();

  return (
    <>
      <Hero />
      <Container className="py-16 sm:py-20">
        <TrendingDestinations countries={countries} />
      </Container>
      <FeatureHighlights />
    </>
  );
}

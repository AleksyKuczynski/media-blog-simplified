// src/main/components/Main/RubricCard.tsx - FIX EXPORT
import Link from "next/link";

interface RubricCardProps {
  rubric: {
    slug: string;
    name: string;
    articleCount: number;
  };
  lang: string;
}

// ✅ FIX: Export as named export to match imports
export function RubricCard({ rubric, lang }: RubricCardProps) {
  return (
    <Link href={`/ru/${rubric.slug}`} className="block group">
      <div className="
        h-full bg-sf-cont rounded-2xl border border-ol-var 
        shadow-sm hover:shadow-lg transition-shadow duration-200
        p-6
      ">
        <h3 className="
          text-lg font-display font-semibold mb-2
          text-on-sf group-hover:text-pr-cont
          transition-colors duration-200
        ">
          {rubric.name}
        </h3>
        <p className="text-sm text-on-sf-var">
          {rubric.articleCount} articles
        </p>
      </div>
    </Link>
  );
}

// ✅ ALSO: Export as default for backward compatibility
export default RubricCard;
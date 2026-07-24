import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { LessonPageClient } from "@/components/dbms/lesson-page-client";
import navigationData from "@/lib/dbms-navigation.json";

interface Module {
  title: string;
  slug: string;
  order: number;
  lessons: { title: string; slug: string; moduleSlug: string; url: string; num: number; }[];
}

const navigation = navigationData as Module[];

export async function generateStaticParams() {
  const params: { moduleSlug: string; lessonSlug: string }[] = [];
  navigation.forEach(mod => {
    mod.lessons.forEach(l => {
      params.push({ moduleSlug: mod.slug, lessonSlug: l.slug });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const mod = navigation.find(m => m.slug === moduleSlug);
  const lesson = mod?.lessons.find(l => l.slug === lessonSlug);
  if (!lesson) return { title: "Lesson Not Found" };
  return {
    title: `${lesson.title} | ${mod?.title}`,
    description: `Learn ${lesson.title} — part of the ${mod?.title} module in the DBMS course.`,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;

  const mod = navigation.find(m => m.slug === moduleSlug);
  if (!mod) notFound();
  const lesson = mod!.lessons.find(l => l.slug === lessonSlug);
  if (!lesson) notFound();

  // Load raw HTML content
  const contentPath = path.join(process.cwd(), "public", "content", `${lessonSlug}.html`);
  let contentHtml = "";
  if (fs.existsSync(contentPath)) {
    contentHtml = fs.readFileSync(contentPath, "utf-8");
  }

  // Build prev / next (adjusted for new nested paths)
  const allLessons = navigation.flatMap(m => m.lessons.map(l => ({ 
    ...l, 
    module: m.title,
    resolvedUrl: `/resources/dbms/${l.moduleSlug}/${l.slug}` 
  })));
  const currentIdx = allLessons.findIndex(l => l.slug === lessonSlug);
  const prev = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const next = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Extract headings for TOC
  const headings: { id: string; text: string; level: number }[] = [];
  const headingMatches = contentHtml.matchAll(/<h([1-4])[^>]*>(.*?)<\/h[1-4]>/gi);
  for (const m of headingMatches) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    headings.push({ id, text, level: parseInt(m[1]) });
  }

  return (
    <LessonPageClient
      lesson={lesson}
      module={mod!}
      contentHtml={contentHtml}
      headings={headings}
      prev={prev}
      next={next}
      currentOrder={currentIdx + 1}
      totalLessons={allLessons.length}
    />
  );
}

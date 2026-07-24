import { redirect } from "next/navigation";
import navigationData from "@/lib/dbms-navigation.json";

export default function DBMSIndex() {
  const nav = navigationData as any[];
  const first = nav[0]?.lessons[0];
  if (first) {
    redirect(`/resources/dbms/${first.moduleSlug}/${first.slug}`);
  } else {
    return <div>No lessons found</div>;
  }
}

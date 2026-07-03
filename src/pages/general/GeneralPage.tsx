import GeneralPageContent from "@/components/pages/general/GeneralPageContent";

interface GeneralPageProps {
  basePath?: string;
}

export default function GeneralPage({ basePath }: GeneralPageProps) {
  return (
      <GeneralPageContent basePath={basePath} />
  );
}

import { SeoAssistant } from "@/components/admin/seo-assistant";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";

export default function SeoPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="SEO & Marketing"
        description="Optimize your online presence and marketing strategy for SPEAR"
      />
      <div className="grid gap-8">
        <SeoAssistant />
      </div>
    </DashboardShell>
  );
}

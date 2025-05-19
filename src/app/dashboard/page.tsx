import DashboardSection from '@/components/dashboard/dashboard-section';
import {
  getHeroDataListServices,
  getSkillDataListServices,
} from '@/services/HomeServices';

export default async function Dashboard() {
  const heroSectionData = (await getHeroDataListServices()).data;
  const skillSectionData = (await getSkillDataListServices()).data;
  return (
    <div>
      <DashboardSection
        heroData={heroSectionData}
        skillData={skillSectionData}
      />
    </div>
  );
}

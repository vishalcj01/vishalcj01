import {ProfileSection} from '@/components/ProfileSection';
import {MissionSection} from '@/components/MissionSection';
import {AIMentorSection} from '@/components/AIMentorSection';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <ProfileSection />
      <div className="flex flex-col flex-1 gap-4">
        <MissionSection />
        <AIMentorSection />
      </div>
    </div>
  );
}

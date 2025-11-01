import { Achievement } from '@/types';

interface AchievementsListProps {
  achievements: Achievement[];
}

export default function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gradient mb-6">Achievements Unlocked</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-badge achievement-${achievement.rarity}`}
          >
            <span className="text-2xl">{achievement.icon}</span>
            <div className="flex-1">
              <div className="font-semibold">{achievement.title}</div>
              <div className="text-xs opacity-80">{achievement.description}</div>
            </div>
          </div>
        ))}
      </div>
      {achievements.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          No achievements unlocked yet. Keep playing to earn more!
        </p>
      )}
    </div>
  );
}

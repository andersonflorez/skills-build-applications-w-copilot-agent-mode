import { mongoose, MONGO_URL } from '../config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from '../models.js';

// Seed the octofit_db database with test data

async function seed() {
  console.log('Seed the octofit_db database with test data');
  await mongoose.connect(MONGO_URL);

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Workout.deleteMany({}),
    Leaderboard.deleteMany({})
  ]);

  const users = await User.create([
    { name: 'Avery Nguyen', email: 'avery.nguyen@octofit.com' },
    { name: 'Jordan Lee', email: 'jordan.lee@octofit.com' },
    { name: 'Marina Patel', email: 'marina.patel@octofit.com' }
  ]);

  const teams = await Team.create([
    { name: 'Ocean Runners', members: 8, score: 890 },
    { name: 'Peak Performers', members: 5, score: 940 },
    { name: 'Trail Blazers', members: 6, score: 910 }
  ]);

  await Activity.create([
    { type: 'run', userId: users[0]._id.toString(), durationMinutes: 50, caloriesBurned: 480 },
    { type: 'yoga', userId: users[1]._id.toString(), durationMinutes: 35, caloriesBurned: 190 },
    { type: 'cycling', userId: users[2]._id.toString(), durationMinutes: 60, caloriesBurned: 620 }
  ]);

  await Workout.create([
    { name: 'Full Body Strength', focus: 'strength', durationMinutes: 40, difficulty: 'intermediate' },
    { name: 'Morning Mobility', focus: 'flexibility', durationMinutes: 25, difficulty: 'beginner' },
    { name: 'High-Intensity Interval', focus: 'cardio', durationMinutes: 30, difficulty: 'advanced' }
  ]);

  await Leaderboard.create(
    teams.map((team) => ({
      teamId: team._id.toString(),
      teamName: team.name,
      score: team.score
    }))
  );

  console.log('Seed completed successfully.');
  console.log(`Inserted ${users.length} users, ${teams.length} teams, activities, workouts, and leaderboard entries.`);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});

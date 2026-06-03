import express, { Request, Response } from 'express';
import { mongoose, MONGO_URL } from './config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from './models.js';

const app = express();
const PORT = Number(process.env.PORT || 8000);
const CODESPACE_NAME = process.env.CODESPACE_NAME;
const HOST = CODESPACE_NAME ? '0.0.0.0' : 'localhost';
const API_BASE_URL = CODESPACE_NAME 
  ? `https://${CODESPACE_NAME}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

app.use(express.json());

const formatDocument = (doc: any) => ({ id: doc._id.toString(), ...doc });

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Octofit Tracker API is running', apiBaseUrl: API_BASE_URL });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/users/', async (_req: Request, res: Response) => {
  const records = await User.find().lean();
  res.json(records.map((record) => formatDocument(record)));
});

app.post('/api/users/', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const user = await User.create({ name, email });
  res.status(201).json(formatDocument(user.toObject()));
});

app.get('/api/teams/', async (_req: Request, res: Response) => {
  const records = await Team.find().lean();
  res.json(records.map((record) => formatDocument(record)));
});

app.post('/api/teams/', async (req: Request, res: Response) => {
  const { name, members } = req.body;
  if (!name || typeof members !== 'number') {
    return res.status(400).json({ error: 'Team name and member count are required' });
  }
  const team = await Team.create({ name, members, score: 0 });
  res.status(201).json(formatDocument(team.toObject()));
});

app.get('/api/activities/', async (_req: Request, res: Response) => {
  const records = await Activity.find().lean();
  res.json(records.map((record) => formatDocument(record)));
});

app.post('/api/activities/', async (req: Request, res: Response) => {
  const { type, userId, durationMinutes, caloriesBurned } = req.body;
  if (!type || !userId || typeof durationMinutes !== 'number' || typeof caloriesBurned !== 'number') {
    return res.status(400).json({ error: 'Type, userId, durationMinutes, and caloriesBurned are required' });
  }
  const activity = await Activity.create({ type, userId, durationMinutes, caloriesBurned });
  res.status(201).json(formatDocument(activity.toObject()));
});

app.get('/api/leaderboard/', async (_req: Request, res: Response) => {
  const snapshots = await Leaderboard.find().sort({ score: -1 }).lean();
  if (snapshots.length > 0) {
    return res.json((snapshots as any[]).map((record) => ({
      id: record._id.toString(),
      teamId: record.teamId,
      teamName: record.teamName,
      score: record.score,
      recordedAt: record.recordedAt
    })));
  }

  const teams = await Team.find().sort({ score: -1 }).lean();
  res.json((teams as any[]).map((team) => ({
    teamId: team._id.toString(),
    teamName: team.name,
    score: team.score
  })));
});

app.get('/api/workouts/', async (_req: Request, res: Response) => {
  const records = await Workout.find().lean();
  res.json(records.map((record) => formatDocument(record)));
});

app.post('/api/workouts/', async (req: Request, res: Response) => {
  const { name, focus, durationMinutes, difficulty } = req.body;
  if (!name || !focus || typeof durationMinutes !== 'number' || !difficulty) {
    return res.status(400).json({ error: 'Name, focus, durationMinutes, and difficulty are required' });
  }
  const workout = await Workout.create({ name, focus, durationMinutes, difficulty });
  res.status(201).json(formatDocument(workout.toObject()));
});

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB at', MONGO_URL);
    app.listen(PORT, HOST, () => {
      console.log(`Octofit Tracker backend listening on ${HOST}:${PORT}`);
      console.log(`API base URL: ${API_BASE_URL}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

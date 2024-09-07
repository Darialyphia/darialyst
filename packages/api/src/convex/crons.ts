import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.hourly('clear inactive lobbies', { minuteUTC: 0 }, internal.lobbies.clearInactive);

export default crons;

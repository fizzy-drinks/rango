import axios from 'axios';
import { AEventsPayload } from 'pages/api/aevents';
import { v4 } from 'uuid';

const trackSession = () => {
  const sessionId = sessionStorage.getItem('sessionId') || v4();
  sessionStorage.setItem('sessionId', sessionId);
  return sessionId;
};

const trackEvent = (event: Omit<AEventsPayload, 'session_id'>): void => {
  const payload: AEventsPayload = { ...event, session_id: trackSession() };
  if (process.env.NODE_ENV !== 'production') {
    console.log(payload);
    return;
  }
  axios.post('/api/aevents', payload);
};

export default trackEvent;

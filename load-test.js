import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://nestghana.netlify.app';

export const options = {
 stages: [
  { duration: '20s', target: 5 },
  { duration: '20s', target: 10 },
  { duration: '20s', target: 0 },
],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const response = http.get(BASE_URL);

  check(response, {
    'homepage returns 200': (r) => r.status === 200,
    'homepage has content': (r) => r.body && r.body.length > 0,
  });

  sleep(2);
}
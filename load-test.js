import http from 'k6/http';

export const options = {
  vus: 100,
  duration: '2m',
};

export default function () {
  http.get('http://127.0.0.1:54900');
}
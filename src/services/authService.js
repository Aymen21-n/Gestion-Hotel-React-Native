import { request } from './api';

export const loginAdmin = (emailAdmin, motDePasse) =>
  request('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ emailAdmin, motDePasse }),
  });

export const loginClient = (cin, email) =>
  request('/auth/client/login', {
    method: 'POST',
    body: JSON.stringify({ cin, email }),
  });

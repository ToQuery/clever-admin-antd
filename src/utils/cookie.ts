const key: string = 'clever-web-antd';
const bearer: string = 'Bearer ';

export function setToken(token: string): void {
  localStorage.setItem(key, token);
}

export function getToken(): string | null {
  return localStorage.getItem(key);
}

export function getTokenWithBear(): string {
  return bearer + getToken();
}

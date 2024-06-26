import { jwtDecode as decode } from 'jwt-decode';

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('id_token');
      return true;
    }
    return false;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
    setTimeout(() => {
      window.location.assign('/');
    }, 1200); // Delay redirect by 1.5 seconds to show the toast
  }

  logout() {
    localStorage.removeItem('id_token');
    setTimeout(() => {
      window.location.assign('/');
    }, 1200); // Delay redirect by 1.5 seconds to show the toast
  }
}

export default new AuthService();
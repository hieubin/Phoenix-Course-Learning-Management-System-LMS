import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../lib/response.js';

export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    sendSuccess(res, user, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { user, token } = await authService.loginUser(req.body);
    req.session.userId = user.id;
    sendSuccess(res, { token, user });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.findCurrentUser(req.user.id);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

export default { register, login, me };
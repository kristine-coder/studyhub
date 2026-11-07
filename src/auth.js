const crypto = require('node:crypto');

const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 10 * 60 * 1000;

const MESSAGES = {
  wrongCredentials: 'Email or password is wrong',
  tooManyAttempts: 'Too many attempts. Please try again in 10 minutes.',
  notConfirmed: 'Please confirm your email address first.',
  resetSent: 'If an account exists for this email, we have sent a reset link.',
};

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return { salt, hash };
}

function passwordMatches(password, { salt, hash }) {
  const candidate = Buffer.from(hashPassword(password, salt).hash, 'hex');
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

class AuthService {
  constructor({ mailer, now = () => Date.now() }) {
    this.mailer = mailer;
    this.now = now;
    this.accounts = new Map();
  }

  register({ name, email, password, confirmed = false }) {
    const key = email.toLowerCase();
    this.accounts.set(key, {
      name,
      email: key,
      password: hashPassword(password),
      confirmed,
      failedAttempts: 0,
      blockedUntil: null,
    });
  }

  logIn(email, password) {
    const account = this.accounts.get(email.toLowerCase());

    if (account && account.blockedUntil !== null) {
      if (this.now() < account.blockedUntil) {
        return { ok: false, message: MESSAGES.tooManyAttempts };
      }
      account.blockedUntil = null;
      account.failedAttempts = 0;
    }

    if (!account || !passwordMatches(password, account.password)) {
      return this.#rejectWrongCredentials(account);
    }

    account.failedAttempts = 0;

    if (!account.confirmed) {
      return { ok: false, message: MESSAGES.notConfirmed, offerResendConfirmation: true };
    }

    return { ok: true, page: 'dashboard' };
  }

  resendConfirmation(email) {
    const account = this.accounts.get(email.toLowerCase());
    if (account && !account.confirmed) {
      this.mailer.send({ to: account.email, type: 'confirmation' });
    }
  }

  requestPasswordReset(email) {
    const account = this.accounts.get(email.toLowerCase());
    if (account) {
      this.mailer.send({ to: account.email, type: 'password-reset' });
    }
    return { message: MESSAGES.resetSent };
  }

  #rejectWrongCredentials(account) {
    if (!account) {
      return { ok: false, message: MESSAGES.wrongCredentials };
    }
    account.failedAttempts += 1;
    if (account.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      account.blockedUntil = this.now() + BLOCK_DURATION_MS;
      return { ok: false, message: MESSAGES.tooManyAttempts };
    }
    return { ok: false, message: MESSAGES.wrongCredentials };
  }
}

module.exports = { AuthService, MESSAGES, MAX_FAILED_ATTEMPTS, BLOCK_DURATION_MS };

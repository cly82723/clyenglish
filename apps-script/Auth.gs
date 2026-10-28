/* CLY English Weekly Challenge: who is asking.
   A student types their school email; if it is on the class list (Students tab) the script emails them a 6-digit code.
   The right code gives the device a sign-in token, sent with every request until the student signs out
   or the data is wiped on 31 August. The sheet keeps only a hash of each token, so it can't be used to sign in. */

function UserError(message, signIn) { this.message = message; this.signIn = !!signIn; }

function sendCode(user, body, nowMs) {
  var email = rosterEmail(body.email);
  checkTester(findStudent(email), body); // no code is emailed to a student who opens the trial page
  var cache = CacheService.getScriptCache();
  if (cache.get("wait:" + email)) throw new UserError("A code was sent less than a minute ago. Please check your inbox and spam folder.");
  var sentThisHour = Number(cache.get("hour:" + email) || 0);
  if (sentThisHour >= CONFIG.CODES_PER_HOUR) throw new UserError("Too many codes asked for. Please try again in an hour.");
  if (MailApp.getRemainingDailyQuota() < 1) throw new UserError("No more codes can be sent today. Please try again tomorrow.");
  var code = randomCode();
  MailApp.sendEmail({ to: email, name: "CLY English", subject: "Your CLY English sign-in code: " + code,
    body: "Your code is " + code + ". It works for 10 minutes.\n\nIf you didn't ask for it, you can ignore this email." });
  cache.put("code:" + email, JSON.stringify({ code: code, tries: 0, expires: nowMs + CONFIG.CODE_TTL_S * 1000 }), CONFIG.CODE_TTL_S);
  cache.put("wait:" + email, "1", CONFIG.RESEND_WAIT_S);
  cache.put("hour:" + email, String(sentThisHour + 1), 3600);
  return { sent: true, email: email };
}

function verifyCode(user, body, nowMs) {
  var email = rosterEmail(body.email);
  var cache = CacheService.getScriptCache();
  var saved = JSON.parse(cache.get("code:" + email) || "null");
  if (!saved || nowMs > saved.expires) throw new UserError("That code has expired or been used. Please ask for a new one.");
  if (String(body.code || "").replace(/\s/g, "") !== saved.code) {
    var tries = saved.tries + 1;
    if (tries >= CONFIG.CODE_TRIES) {
      cache.remove("code:" + email);
      throw new UserError("Too many wrong tries. Please ask for a new code.");
    }
    // Put back with only the time it had left, so wrong tries don't keep a code alive.
    cache.put("code:" + email, JSON.stringify({ code: saved.code, tries: tries, expires: saved.expires }), Math.max(1, Math.ceil((saved.expires - nowMs) / 1000)));
    throw new UserError("That code isn't right. Please check it and try again.");
  }
  cache.remove("code:" + email);
  var token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  appendRow("Sessions", { "Token hash": hashOf(token), Email: email, Created: new Date(nowMs) });
  return { token: token, label: studentKey(findStudent(email)) };
}

function signOut(user) {
  deleteRowAt("Sessions", user.sessionRow);
  return { signedOut: true };
}

function verifiedUser(token) {
  if (typeof token !== "string" || !/^[0-9a-f]{64}$/.test(token)) throw new UserError("Please sign in with your school email.", true);
  var hash = hashOf(token);
  var session = readRows("Sessions").filter(function (r) { return r["Token hash"] === hash; })[0];
  // A student the teacher takes off the class list is signed out everywhere.
  var student = session ? findStudent(String(session.Email).toLowerCase()) : null;
  if (!student) throw new UserError("Please sign in again with your school email.", true);
  return { email: String(student.Email).toLowerCase(), student: student, sessionRow: session._row };
}

// Students may type just the part before the @; the school domain is added for them.
function rosterEmail(typed) {
  var email = String(typed || "").trim().toLowerCase();
  if (email && email.indexOf("@") < 0) email += "@" + CONFIG.DOMAIN;
  if (email.length > 100 || !/^[^@\s]+@[^@\s]+$/.test(email)) throw new UserError("Please type your school email.");
  if (!findStudent(email)) throw new UserError("That email isn't on the class list. Check the spelling, or ask your teacher.");
  return email;
}

// getUuid is random from a secure source; 12 of its hex digits give an evenly spread 6-digit code.
function randomCode() {
  var n = parseInt(Utilities.getUuid().replace(/-/g, "").slice(0, 12), 16) % 1000000;
  return ("00000" + n).slice(-6);
}

function hashOf(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s)
    .map(function (b) { return ("0" + ((b + 256) % 256).toString(16)).slice(-2); }).join("");
}

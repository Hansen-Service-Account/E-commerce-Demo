import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SESSION_SECRET,
    cookieName: "hansen-demo-login",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
    },
  });
}

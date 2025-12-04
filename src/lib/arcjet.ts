import "server-only";

import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  // Base rule: optional shield protection
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

export default aj;

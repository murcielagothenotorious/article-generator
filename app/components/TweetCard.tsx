/* eslint-disable @next/next/no-img-element */

import { CSSProperties, ReactNode } from "react";

export type TweetTheme = "dark" | "light";

export const TWEET_DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='#536471'/><text x='50' y='62' font-size='44' font-family='Arial' fill='#fff' text-anchor='middle'>?</text></svg>`,
  );

export function tweetThemeTokens(theme: TweetTheme) {
  return theme === "dark"
    ? {
        bg: "#000000",
        text: "#e7e9ea",
        muted: "#71767b",
        border: "#2f3336",
        link: "#1d9bf0",
      }
    : {
        bg: "#ffffff",
        text: "#0f1419",
        muted: "#536471",
        border: "#eff3f4",
        link: "#1d9bf0",
      };
}

export function VerifiedBadge() {
  return (
    <svg viewBox="0 0 22 22" width="18" height="18" aria-label="Verified">
      <path
        fill="#1d9bf0"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.687.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  );
}

export function renderTweetRichText(text: string, linkColor: string) {
  const parts = text.split(/(\s+)/);
  return parts.map((part, i) => {
    if (/^[@#]\w+/.test(part) || /^https?:\/\/\S+/.test(part)) {
      return (
        <span key={i} style={{ color: linkColor }}>
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function TweetCard({
  name,
  handle,
  tweet,
  timestamp,
  avatar = TWEET_DEFAULT_AVATAR,
  verified = false,
  theme = "dark",
  width = 560,
  style,
  tweetSlot,
  nameSlot,
  handleSlot,
  timestampSlot,
}: {
  name: string;
  handle: string;
  tweet: string;
  timestamp: string;
  avatar?: string;
  verified?: boolean;
  theme?: TweetTheme;
  width?: number | string;
  style?: CSSProperties;
  tweetSlot?: ReactNode;
  nameSlot?: ReactNode;
  handleSlot?: ReactNode;
  timestampSlot?: ReactNode;
}) {
  const tokens = tweetThemeTokens(theme);
  return (
    <div
      style={{
        background: tokens.bg,
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        color: tokens.text,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        padding: 16,
        width,
        ...style,
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <img
          alt=""
          src={avatar || TWEET_DEFAULT_AVATAR}
          style={{
            borderRadius: "50%",
            flex: "0 0 auto",
            height: 48,
            objectFit: "cover",
            width: 48,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontWeight: 700 }}>{nameSlot ?? name}</span>
            {verified ? <VerifiedBadge /> : null}
          </div>
          <div style={{ color: tokens.muted, fontSize: 15, lineHeight: 1.2 }}>
            @{handleSlot ?? handle}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 17,
          lineHeight: 1.4,
          marginTop: 12,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {tweetSlot ?? renderTweetRichText(tweet, tokens.link)}
      </div>
      <div
        style={{
          color: tokens.muted,
          fontSize: 15,
          marginTop: 12,
          paddingTop: 12,
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        {timestampSlot ?? timestamp}
      </div>
    </div>
  );
}

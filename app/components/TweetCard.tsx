/* eslint-disable @next/next/no-img-element */

import { CSSProperties, ReactNode } from "react";

export type TweetTheme = "dark" | "light";
export type TweetVariant = "tweet" | "repost" | "profile";

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
        bannerBg: "#2f3336",
      }
    : {
        bg: "#ffffff",
        text: "#0f1419",
        muted: "#536471",
        border: "#eff3f4",
        link: "#1d9bf0",
        bannerBg: "#cfd9de",
      };
}

export function VerifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 22 22" width={size} height={size} aria-label="Verified">
      <path
        fill="#1d9bf0"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.687.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  );
}

function RepostIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-label="Repost">
      <path
        fill={color}
        d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
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

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export function TweetCard({
  name,
  handle,
  tweet,
  timestamp,
  avatar = TWEET_DEFAULT_AVATAR,
  verified = false,
  theme = "dark",
  width = 560,
  media,
  style,
  variant = "tweet",
  reposterName,
  bio,
  banner,
  location,
  joinDate,
  following,
  followers,
}: {
  name: string;
  handle: string;
  tweet: string;
  timestamp: string;
  avatar?: string;
  verified?: boolean;
  theme?: TweetTheme;
  width?: number | string;
  media?: string;
  style?: CSSProperties;
  variant?: TweetVariant;
  reposterName?: string;
  bio?: string;
  banner?: string;
  location?: string;
  joinDate?: string;
  following?: string;
  followers?: string;
}) {
  const tokens = tweetThemeTokens(theme);

  if (variant === "profile") {
    return (
      <ProfileCard
        avatar={avatar}
        banner={banner}
        bio={bio}
        followers={followers}
        following={following}
        handle={handle}
        joinDate={joinDate}
        location={location}
        name={name}
        style={style}
        theme={theme}
        verified={verified}
        width={width}
      />
    );
  }

  return (
    <div
      style={{
        background: tokens.bg,
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        color: tokens.text,
        fontFamily: FONT_STACK,
        padding: 16,
        width,
        ...style,
      }}
    >
      {variant === "repost" ? (
        <div
          style={{
            alignItems: "center",
            color: tokens.muted,
            display: "flex",
            fontSize: 13,
            fontWeight: 700,
            gap: 8,
            marginBottom: 8,
            paddingLeft: 24,
          }}
        >
          <RepostIcon color={tokens.muted} />
          <span>{reposterName || name} reposted</span>
        </div>
      ) : null}
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
            <span style={{ fontWeight: 700 }}>{name}</span>
            {verified ? <VerifiedBadge /> : null}
          </div>
          <div style={{ color: tokens.muted, fontSize: 15, lineHeight: 1.2 }}>
            @{handle}
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
        {renderTweetRichText(tweet, tokens.link)}
      </div>
      {media ? (
        <div
          style={{
            border: `1px solid ${tokens.border}`,
            borderRadius: 16,
            marginTop: 12,
            overflow: "hidden",
          }}
        >
          <img
            alt=""
            src={media}
            style={{ display: "block", maxHeight: 510, objectFit: "cover", width: "100%" }}
          />
        </div>
      ) : null}
      <div
        style={{
          color: tokens.muted,
          fontSize: 15,
          marginTop: 12,
          paddingTop: 12,
          borderTop: `1px solid ${tokens.border}`,
        }}
      >
        {timestamp}
      </div>
    </div>
  );
}

function ProfileCard({
  name,
  handle,
  avatar,
  verified,
  theme,
  width,
  banner,
  bio,
  location,
  joinDate,
  following,
  followers,
  style,
}: {
  name: string;
  handle: string;
  avatar?: string;
  verified?: boolean;
  theme: TweetTheme;
  width: number | string;
  banner?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  following?: string;
  followers?: string;
  style?: CSSProperties;
}) {
  const tokens = tweetThemeTokens(theme);
  const avatarSize = 128;

  return (
    <div
      style={{
        background: tokens.bg,
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        color: tokens.text,
        fontFamily: FONT_STACK,
        overflow: "hidden",
        width,
        ...style,
      }}
    >
      <div
        style={{
          background: banner ? `url(${banner}) center/cover` : tokens.bannerBg,
          height: 200,
          width: "100%",
        }}
      />
      <div style={{ padding: "0 16px 16px", position: "relative" }}>
        <div
          style={{
            alignItems: "flex-end",
            display: "flex",
            justifyContent: "space-between",
            marginTop: -avatarSize / 2,
          }}
        >
          <img
            alt=""
            src={avatar || TWEET_DEFAULT_AVATAR}
            style={{
              background: tokens.bg,
              border: `4px solid ${tokens.bg}`,
              borderRadius: "50%",
              height: avatarSize,
              objectFit: "cover",
              width: avatarSize,
            }}
          />
          <button
            style={{
              background: tokens.text,
              border: 0,
              borderRadius: 999,
              color: tokens.bg,
              cursor: "default",
              fontSize: 15,
              fontWeight: 700,
              marginTop: avatarSize / 2 + 12,
              padding: "8px 16px",
            }}
            type="button"
          >
            Follow
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 800 }}>{name}</span>
            {verified ? <VerifiedBadge size={20} /> : null}
          </div>
          <div style={{ color: tokens.muted, fontSize: 15 }}>@{handle}</div>
        </div>
        {bio ? (
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.35,
              marginTop: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {renderTweetRichText(bio, tokens.link)}
          </div>
        ) : null}
        <div
          style={{
            color: tokens.muted,
            display: "flex",
            flexWrap: "wrap",
            fontSize: 15,
            gap: 16,
            marginTop: 12,
          }}
        >
          {location ? (
            <span style={{ alignItems: "center", display: "flex", gap: 4 }}>
              <Pin color={tokens.muted} /> {location}
            </span>
          ) : null}
          {joinDate ? (
            <span style={{ alignItems: "center", display: "flex", gap: 4 }}>
              <CalendarIcon color={tokens.muted} /> Joined {joinDate}
            </span>
          ) : null}
        </div>
        <div
          style={{
            color: tokens.muted,
            display: "flex",
            fontSize: 15,
            gap: 18,
            marginTop: 12,
          }}
        >
          {following ? (
            <span>
              <strong style={{ color: tokens.text }}>{following}</strong> Following
            </span>
          ) : null}
          {followers ? (
            <span>
              <strong style={{ color: tokens.text }}>{followers}</strong> Followers
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Pin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden>
      <path
        fill={color}
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
      />
    </svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden>
      <path
        fill={color}
        d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2zM5 22h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zM19 8v12H5V8h14z"
      />
    </svg>
  );
}

export type { ReactNode };

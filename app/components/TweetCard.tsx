/* eslint-disable @next/next/no-img-element */

import { CSSProperties, ReactNode } from "react";

export type TweetTheme = "dark" | "light";
export type TweetVariant = "tweet" | "repost" | "profile";
export type RepostStyle = "header" | "quote";
export type TweetLang = "tr" | "en";

const TWEET_LABELS: Record<TweetLang, {
  reposted: string;
  follow: string;
  joined: string;
  following: string;
  followers: string;
  views: string;
}> = {
  tr: {
    reposted: "yeniden paylaştı",
    follow: "Takip et",
    joined: "Katıldı:",
    following: "Takip edilen",
    followers: "Takipçi",
    views: "Görüntüleme",
  },
  en: {
    reposted: "reposted",
    follow: "Follow",
    joined: "Joined",
    following: "Following",
    followers: "Followers",
    views: "Views",
  },
};

export function tweetLabels(lang: TweetLang) {
  return TWEET_LABELS[lang] ?? TWEET_LABELS.en;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatTweetTimestamp(input: string | Date, lang: TweetLang): string {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return typeof input === "string" ? input : "";
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const hr12 = hours % 12 || 12;
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  if (lang === "tr") {
    const period = hours < 12 ? "ÖÖ" : "ÖS";
    return `${period} ${hr12}:${minutes} · ${day} ${month} ${year}`;
  }
  const period = hours < 12 ? "AM" : "PM";
  return `${hr12}:${minutes} ${period} · ${month} ${day}, ${year}`;
}

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

function RepostIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Repost">
      <path
        fill={color}
        d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
      />
    </svg>
  );
}

function MoreIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="More">
      <circle cx="5" cy="12" r="2" fill={color} />
      <circle cx="12" cy="12" r="2" fill={color} />
      <circle cx="19" cy="12" r="2" fill={color} />
    </svg>
  );
}

function ReplyIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Reply">
      <path
        fill={color}
        d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"
      />
    </svg>
  );
}

function LikeIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Like">
      <path
        fill={color}
        d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
      />
    </svg>
  );
}

function LikeFilledIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Liked">
      <path
        fill="#f91880"
        d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
      />
    </svg>
  );
}

function BookmarkIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Bookmark">
      <path
        fill={color}
        d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"
      />
    </svg>
  );
}

function ShareIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Share">
      <path
        fill={color}
        d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"
      />
    </svg>
  );
}

export type TweetStats = {
  replies?: string;
  reposts?: string;
  likes?: string;
  views?: string;
  liked?: boolean;
};

function TweetActionBar({
  stats,
  theme,
}: {
  stats: TweetStats;
  theme: TweetTheme;
}) {
  const tokens = tweetThemeTokens(theme);
  const item: CSSProperties = {
    alignItems: "center",
    color: tokens.muted,
    display: "flex",
    fontSize: 13,
    gap: 6,
  };
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        marginTop: 10,
      }}
    >
      <div style={item}>
        <ReplyIcon color={tokens.muted} />
        {stats.replies ? <span>{stats.replies}</span> : null}
      </div>
      <div style={item}>
        <RepostIcon color={tokens.muted} size={18} />
        {stats.reposts ? <span>{stats.reposts}</span> : null}
      </div>
      <div style={item}>
        {stats.liked ? <LikeFilledIcon /> : <LikeIcon color={tokens.muted} />}
        {stats.likes ? (
          <span style={{ color: stats.liked ? "#f91880" : tokens.muted }}>{stats.likes}</span>
        ) : null}
      </div>
      <div style={item}>
        <BookmarkIcon color={tokens.muted} />
      </div>
      <div style={item}>
        <ShareIcon color={tokens.muted} />
      </div>
    </div>
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
  repostStyle = "header",
  reposterAvatar,
  reposterHandle,
  reposterTweet,
  reposterTimestamp,
  reposterVerified,
  bio,
  banner,
  location,
  joinDate,
  following,
  followers,
  lang = "en",
  stats,
  showActions = true,
  relativeTime,
  showMoreMenu = true,
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
  repostStyle?: RepostStyle;
  reposterAvatar?: string;
  reposterHandle?: string;
  reposterTweet?: string;
  reposterTimestamp?: string;
  reposterVerified?: boolean;
  lang?: TweetLang;
  bio?: string;
  banner?: string;
  location?: string;
  joinDate?: string;
  following?: string;
  followers?: string;
  stats?: TweetStats;
  showActions?: boolean;
  relativeTime?: string;
  showMoreMenu?: boolean;
}) {
  const tokens = tweetThemeTokens(theme);
  const labels = tweetLabels(lang);

  if (variant === "repost" && repostStyle === "quote") {
    return (
      <QuoteRepostCard
        avatar={avatar}
        handle={handle}
        lang={lang}
        media={media}
        name={name}
        reposterAvatar={reposterAvatar}
        reposterHandle={reposterHandle}
        reposterName={reposterName || name}
        reposterTimestamp={reposterTimestamp}
        reposterTweet={reposterTweet}
        reposterVerified={reposterVerified}
        showActions={showActions}
        stats={stats}
        style={style}
        theme={theme}
        timestamp={timestamp}
        tweet={tweet}
        verified={verified}
        width={width}
      />
    );
  }

  if (variant === "profile") {
    return (
      <ProfileCard
        labels={labels}
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
          <span>{reposterName || name} {labels.reposted}</span>
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
          <div style={{ alignItems: "center", display: "flex", gap: 4, justifyContent: "space-between" }}>
            <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 4, minWidth: 0 }}>
              <span style={{ fontWeight: 700 }}>{name}</span>
              {verified ? <VerifiedBadge /> : null}
            </div>
            {showMoreMenu ? <MoreIcon color={tokens.muted} /> : null}
          </div>
          <div style={{ color: tokens.muted, fontSize: 15, lineHeight: 1.2 }}>
            @{handle}{relativeTime ? ` · ${relativeTime}` : ""}
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
      <div style={{ color: tokens.muted, fontSize: 15, marginTop: 12 }}>
        {timestamp}
        {stats?.views ? (
          <>
            {" · "}
            <strong style={{ color: tokens.text }}>{stats.views}</strong> {labels.views}
          </>
        ) : null}
      </div>
      {showActions ? <TweetActionBar stats={stats ?? {}} theme={theme} /> : null}
    </div>
  );
}

function QuoteRepostCard({
  name,
  handle,
  tweet,
  timestamp,
  avatar,
  verified,
  media,
  theme,
  width,
  style,
  reposterName,
  reposterHandle,
  reposterAvatar,
  reposterTweet,
  reposterTimestamp,
  reposterVerified,
  stats,
  showActions,
  lang = "en",
}: {
  name: string;
  handle: string;
  tweet: string;
  timestamp: string;
  avatar?: string;
  verified?: boolean;
  media?: string;
  theme: TweetTheme;
  width: number | string;
  style?: CSSProperties;
  reposterName: string;
  reposterHandle?: string;
  reposterAvatar?: string;
  reposterTweet?: string;
  reposterTimestamp?: string;
  reposterVerified?: boolean;
  stats?: TweetStats;
  showActions?: boolean;
  lang?: TweetLang;
}) {
  const labels = tweetLabels(lang);
  const tokens = tweetThemeTokens(theme);

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
      <div style={{ display: "flex", gap: 12 }}>
        <img
          alt=""
          src={reposterAvatar || TWEET_DEFAULT_AVATAR}
          style={{ borderRadius: "50%", flex: "0 0 auto", height: 48, objectFit: "cover", width: 48 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontWeight: 700 }}>{reposterName}</span>
            {reposterVerified ? <VerifiedBadge /> : null}
          </div>
          <div style={{ color: tokens.muted, fontSize: 15, lineHeight: 1.2 }}>
            @{reposterHandle || "reposter"}
          </div>
        </div>
      </div>
      {reposterTweet ? (
        <div
          style={{
            fontSize: 17,
            lineHeight: 1.4,
            marginTop: 12,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {renderTweetRichText(reposterTweet, tokens.link)}
        </div>
      ) : null}

      {/* Nested original tweet */}
      <div
        style={{
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
          marginTop: 12,
          padding: 12,
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
          <img
            alt=""
            src={avatar || TWEET_DEFAULT_AVATAR}
            style={{ borderRadius: "50%", flex: "0 0 auto", height: 20, objectFit: "cover", width: 20 }}
          />
          <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
          {verified ? <VerifiedBadge size={14} /> : null}
          <span style={{ color: tokens.muted, fontSize: 15 }}>@{handle}</span>
          <span style={{ color: tokens.muted, fontSize: 15 }}>·</span>
          <span style={{ color: tokens.muted, fontSize: 15 }}>{timestamp}</span>
        </div>
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.4,
            marginTop: 6,
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
              borderRadius: 12,
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <img
              alt=""
              src={media}
              style={{ display: "block", maxHeight: 360, objectFit: "cover", width: "100%" }}
            />
          </div>
        ) : null}
      </div>

      <div style={{ color: tokens.muted, fontSize: 15, marginTop: 12 }}>
        {reposterTimestamp || timestamp}
        {stats?.views ? (
          <>
            {" · "}
            <strong style={{ color: tokens.text }}>{stats.views}</strong>{" "}
            {labels.views}
          </>
        ) : null}
      </div>
      {showActions ? <TweetActionBar stats={stats ?? {}} theme={theme} /> : null}
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
  labels,
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
  labels: ReturnType<typeof tweetLabels>;
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
            {labels.follow}
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
              <CalendarIcon color={tokens.muted} /> {labels.joined} {joinDate}
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
              <strong style={{ color: tokens.text }}>{following}</strong> {labels.following}
            </span>
          ) : null}
          {followers ? (
            <span>
              <strong style={{ color: tokens.text }}>{followers}</strong> {labels.followers}
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

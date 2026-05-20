"use client";

import { ChangeEvent, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  RepostStyle,
  TWEET_DEFAULT_AVATAR,
  TweetCard,
  TweetLang,
  TweetTheme,
  TweetVariant,
} from "../components/TweetCard";

export default function TwitterCardPage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("Display Name");
  const [handle, setHandle] = useState("handle");
  const [verified, setVerified] = useState(true);
  const [avatar, setAvatar] = useState(TWEET_DEFAULT_AVATAR);
  const [media, setMedia] = useState("");
  const [variant, setVariant] = useState<TweetVariant>("tweet");
  const [repostStyle, setRepostStyle] = useState<RepostStyle>("header");
  const [reposterName, setReposterName] = useState("Reposter");
  const [reposterHandle, setReposterHandle] = useState("reposter");
  const [reposterAvatar, setReposterAvatar] = useState(TWEET_DEFAULT_AVATAR);
  const [reposterTweet, setReposterTweet] = useState("Yorumlu repost metni...");
  const [reposterTimestamp, setReposterTimestamp] = useState("1:00 PM · 16 May 2026");
  const [reposterVerified, setReposterVerified] = useState(false);
  const [banner, setBanner] = useState("");
  const [bio, setBio] = useState("Bio buraya. @mention, #hashtag, link vurgulanır.");
  const [location, setLocation] = useState("İstanbul, Türkiye");
  const [joinDate, setJoinDate] = useState("May 2020");
  const [following, setFollowing] = useState("128");
  const [followers, setFollowers] = useState("4,231");
  const [tweet, setTweet] = useState(
    "Tweet metni buraya. Linkler, #etiketler ve @bahsetmeler otomatik vurgulanır.",
  );
  const [timestamp, setTimestamp] = useState("12:34 PM · 16 May 2026");
  const [theme, setTheme] = useState<TweetTheme>("dark");
  const [lang, setLang] = useState<TweetLang>("tr");
  const [status, setStatus] = useState("");

  function onAvatarFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  function onMediaFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setMedia("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setMedia(String(reader.result));
    reader.readAsDataURL(file);
  }

  function onReposterAvatarFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReposterAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  function onBannerFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setBanner("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setBanner(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function download() {
    if (!cardRef.current) return;
    setStatus("PNG hazırlanıyor...");
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: Math.max(2, window.devicePixelRatio || 1),
        cacheBust: true,
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `tweet-${handle || "card"}.png`;
      link.href = dataUrl;
      link.click();
      setStatus("İndirildi.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "İndirilemedi.");
    }
  }

  return (
    <main style={pageStyle}>
      <style>{`
        .tc-panel input, .tc-panel textarea, .tc-panel select {
          background: #0b0b0c;
          border: 1px solid #2a2a2e;
          border-radius: 6px;
          color: #e7e9ea;
          font: inherit;
          padding: 8px 10px;
          width: 100%;
        }
        .tc-panel textarea { resize: vertical; font-family: inherit; }
        .tc-panel input[type="checkbox"] { width: auto; }
        .tc-panel input[type="file"] { padding: 4px; }
      `}</style>
      <aside className="tc-panel" style={panelStyle}>
        <h1 style={{ fontSize: 18, margin: "0 0 8px" }}>Tweet kartı</h1>
        <p style={{ color: "#9aa0a6", fontSize: 13, margin: "0 0 16px" }}>
          Tek görsel olarak PNG indirir.
        </p>

        <Field label="Görünüm">
          <select value={variant} onChange={(e) => setVariant(e.target.value as TweetVariant)}>
            <option value="tweet">Tweet</option>
            <option value="repost">Repost</option>
            <option value="profile">Profil</option>
          </select>
        </Field>

        <Field label="Avatar (görsel)">
          <input type="file" accept="image/*" onChange={onAvatarFile} />
        </Field>
        <Field label="Display name">
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Handle (@ olmadan)">
          <input value={handle} onChange={(e) => setHandle(e.target.value)} />
        </Field>
        <Field label="Tema">
          <select value={theme} onChange={(e) => setTheme(e.target.value as TweetTheme)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </Field>
        <Field label="Dil">
          <select value={lang} onChange={(e) => setLang(e.target.value as TweetLang)}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </Field>
        <Field label="">
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
            <input
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            Verified rozeti
          </label>
        </Field>

        {variant !== "profile" ? (
          <>
            <Field label="Tweet metni">
              <textarea rows={6} value={tweet} onChange={(e) => setTweet(e.target.value)} />
            </Field>
            <Field label="Zaman damgası">
              <input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
            </Field>
            <Field label="Tweet görseli (opsiyonel)">
              <input type="file" accept="image/*" onChange={onMediaFile} />
              {media ? (
                <button
                  onClick={() => setMedia("")}
                  style={removeBtnStyle}
                  type="button"
                >
                  Görseli kaldır
                </button>
              ) : null}
            </Field>
          </>
        ) : null}

        {variant === "repost" ? (
          <>
            <Field label="Repost stili">
              <select
                value={repostStyle}
                onChange={(e) => setRepostStyle(e.target.value as RepostStyle)}
              >
                <option value="header">Üstte "reposted" başlığı</option>
                <option value="quote">Div içinde div (alıntı kart)</option>
              </select>
            </Field>
            <Field label="Repostlayan kişi (display name)">
              <input value={reposterName} onChange={(e) => setReposterName(e.target.value)} />
            </Field>
            {repostStyle === "quote" ? (
              <>
                <Field label="Repostlayan handle">
                  <input
                    value={reposterHandle}
                    onChange={(e) => setReposterHandle(e.target.value)}
                  />
                </Field>
                <Field label="Repostlayan avatar">
                  <input type="file" accept="image/*" onChange={onReposterAvatarFile} />
                </Field>
                <Field label="Repostlayan yorumu">
                  <textarea
                    rows={3}
                    value={reposterTweet}
                    onChange={(e) => setReposterTweet(e.target.value)}
                  />
                </Field>
                <Field label="Repostlayan zaman">
                  <input
                    value={reposterTimestamp}
                    onChange={(e) => setReposterTimestamp(e.target.value)}
                  />
                </Field>
                <Field label="">
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={reposterVerified}
                      onChange={(e) => setReposterVerified(e.target.checked)}
                    />
                    Repostlayan verified
                  </label>
                </Field>
              </>
            ) : null}
          </>
        ) : null}

        {variant === "profile" ? (
          <>
            <Field label="Banner görseli">
              <input type="file" accept="image/*" onChange={onBannerFile} />
              {banner ? (
                <button onClick={() => setBanner("")} style={removeBtnStyle} type="button">
                  Banner'ı kaldır
                </button>
              ) : null}
            </Field>
            <Field label="Bio">
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
            </Field>
            <Field label="Konum">
              <input value={location} onChange={(e) => setLocation(e.target.value)} />
            </Field>
            <Field label="Katılma tarihi">
              <input value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
            </Field>
            <Field label="Following">
              <input value={following} onChange={(e) => setFollowing(e.target.value)} />
            </Field>
            <Field label="Followers">
              <input value={followers} onChange={(e) => setFollowers(e.target.value)} />
            </Field>
          </>
        ) : null}

        <button onClick={download} style={buttonStyle} type="button">
          PNG olarak indir
        </button>
        <p style={{ color: "#9aa0a6", fontSize: 12, marginTop: 8 }}>{status}</p>
      </aside>

      <section style={canvasStyle}>
        <div ref={cardRef}>
          <TweetCard
            avatar={avatar}
            banner={banner || undefined}
            bio={bio}
            followers={followers}
            following={following}
            handle={handle}
            joinDate={joinDate}
            lang={lang}
            location={location}
            media={media || undefined}
            name={name}
            repostStyle={repostStyle}
            reposterAvatar={reposterAvatar}
            reposterHandle={reposterHandle}
            reposterName={reposterName}
            reposterTimestamp={reposterTimestamp}
            reposterTweet={reposterTweet}
            reposterVerified={reposterVerified}
            theme={theme}
            timestamp={timestamp}
            tweet={tweet}
            variant={variant}
            verified={verified}
          />
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      {label ? (
        <span style={{ color: "#9aa0a6", display: "block", fontSize: 12, marginBottom: 4 }}>
          {label}
        </span>
      ) : null}
      {children}
    </label>
  );
}

const pageStyle: React.CSSProperties = {
  background: "#0b0b0c",
  color: "#e7e9ea",
  display: "grid",
  gap: 24,
  gridTemplateColumns: "320px 1fr",
  minHeight: "100vh",
  padding: 24,
};

const panelStyle: React.CSSProperties = {
  background: "#141416",
  border: "1px solid #2a2a2e",
  borderRadius: 12,
  padding: 16,
  height: "fit-content",
};

const canvasStyle: React.CSSProperties = {
  alignItems: "flex-start",
  display: "flex",
  justifyContent: "center",
  padding: 24,
};

const removeBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #783b3b",
  borderRadius: 6,
  color: "#ffb9b9",
  fontSize: 12,
  marginTop: 6,
  padding: "4px 8px",
};

const buttonStyle: React.CSSProperties = {
  background: "#1d9bf0",
  border: 0,
  borderRadius: 999,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  padding: "10px 16px",
  width: "100%",
};

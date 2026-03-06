import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./AdDetailView.module.css";
import { useGetAdByIdQuery, useGetAdImagesQuery } from "../../services/adsApi";

export default function AdDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  const { data: ad, isLoading, isError } = useGetAdByIdQuery(id);
  const { data: imagesData } = useGetAdImagesQuery({ ad: id });
  const images = imagesData?.results ?? imagesData ?? [];

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);

  if (isLoading)
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p>Loading…</p>
      </div>
    );
  if (isError || !ad)
    return (
      <div className={styles.errorPage}>
        <span>⚠️</span>
        <p>Ad not found.</p>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Go back
        </button>
      </div>
    );

  const expired = ad.expired_at && new Date(ad.expired_at) < new Date();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backLink} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className={styles.adLabel}>Sponsored</span>
      </div>

      <div className={styles.inner}>
        {/* Carousel */}
        {images.length > 0 && (
          <div className={styles.carousel}>
            <img
              key={idx}
              src={images[idx]?.image}
              alt={ad.title}
              className={styles.carouselImg}
            />
            {images.length > 1 && (
              <>
                <button
                  className={styles.carouselPrev}
                  onClick={() =>
                    setIdx((i) => (i - 1 + images.length) % images.length)
                  }
                >
                  ‹
                </button>
                <button
                  className={styles.carouselNext}
                  onClick={() => setIdx((i) => (i + 1) % images.length)}
                >
                  ›
                </button>
                <div className={styles.carouselDots}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
                      onClick={() => setIdx(i)}
                    />
                  ))}
                </div>
              </>
            )}
            {expired && <div className={styles.expiredOverlay}>Expired</div>}
          </div>
        )}

        {/* Body */}
        <div className={styles.body}>
          {expired && (
            <div className={styles.expiredBanner}>This ad has expired</div>
          )}
          <h1 className={styles.title}>{ad.title}</h1>

          <div className={styles.meta}>
            {ad.created_at && (
              <span className={styles.metaChip}>
                📅 Posted{" "}
                {new Date(ad.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {ad.expired_at && !expired && (
              <span className={styles.metaChip}>
                ⏳ Until{" "}
                {new Date(ad.expired_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            <span
              className={`${styles.metaChip} ${ad.active && !expired ? styles.metaChipGreen : styles.metaChipGrey}`}
            >
              {ad.active && !expired ? "● Active" : "● Inactive"}
            </span>
          </div>

          {ad.description && (
            <div className={styles.description}>
              {ad.description
                .split(/\n+/)
                .map((p, i) => p.trim() && <p key={i}>{p}</p>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PLACE_ID = 'ChIJoSjAz_NDs0cRHIr2ORt3gqs';
const CACHE_KEY = 'google-reviews';
const FALLBACK_KEY = 'google-reviews-fallback';
const CACHE_TTL_SECONDS = 43200;

export async function onRequestGet(context) {
  const { env } = context;

  try {
    const cached = await env.REVIEWS_CACHE.get(CACHE_KEY);
    if (cached) return jsonResponse(cached);
  } catch (err) {
    // KV read failed — fall through and try a fresh fetch from Google.
  }

  try {
    const apiRes = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=de`,
      {
        headers: {
          'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'reviews,rating,userRatingCount,googleMapsUri',
        },
      }
    );

    if (!apiRes.ok) throw new Error('places-api-error');

    const data = await apiRes.json();
    const payload = JSON.stringify(reduceReviews(data));

    context.waitUntil(
      Promise.allSettled([
        env.REVIEWS_CACHE.put(CACHE_KEY, payload, { expirationTtl: CACHE_TTL_SECONDS }),
        env.REVIEWS_CACHE.put(FALLBACK_KEY, payload),
      ])
    );

    return jsonResponse(payload);
  } catch (err) {
    return await serveFallback(env);
  }
}

async function serveFallback(env) {
  try {
    const fallback = await env.REVIEWS_CACHE.get(FALLBACK_KEY);
    if (fallback) return jsonResponse(fallback);
  } catch (err) {
    // KV read failed too — nothing left to serve.
  }
  return new Response(null, { status: 503 });
}

function reduceReviews(data) {
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];
  return {
    rating: typeof data.rating === 'number' ? data.rating : null,
    total: typeof data.userRatingCount === 'number' ? data.userRatingCount : 0,
    profileUrl: data.googleMapsUri || '',
    reviews: reviews.map((review) => {
      const name = review.authorAttribution?.displayName || '';
      return {
        author: name,
        initial: name.trim().charAt(0).toUpperCase() || '?',
        rating: typeof review.rating === 'number' ? review.rating : 0,
        text: review.text?.text || '',
        relativeTime: review.relativePublishTimeDescription || '',
      };
    }),
  };
}

function jsonResponse(body) {
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}

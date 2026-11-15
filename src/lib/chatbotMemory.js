import seedFaqs from "../data/chatbot-faqs.json";

export const SEED_FAQS = Array.isArray(seedFaqs) ? seedFaqs : [];

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "am",
  "was",
  "were",
  "be",
  "been",
  "being",
  "do",
  "does",
  "did",
  "can",
  "could",
  "will",
  "would",
  "should",
  "may",
  "might",
  "must",
  "have",
  "has",
  "had",
  "i",
  "me",
  "my",
  "you",
  "your",
  "yours",
  "we",
  "our",
  "they",
  "their",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "what",
  "which",
  "who",
  "whom",
  "where",
  "when",
  "why",
  "how",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "about",
  "into",
  "or",
  "and",
  "if",
  "so",
  "tell",
  "please",
  "explain",
  "give",
  "get",
  "know",
  "there",
  "any",
  "all",
  "some",
]);

const SYNONYM_REPLACEMENTS = [
  [/\bthirteen\s+weeks?\b/g, "13-week"],
  [/\b13\s+weeks?\b/g, "13-week"],
  [/\bthirteen\s+week\b/g, "13-week"],
  [/\btwenty\s+years?\b/g, "20-year"],
  [/\b20\s+years?\b/g, "20-year"],
  [/\bfourteen\s+days?\b/g, "14-day"],
  [/\b14\s+days?\b/g, "14-day"],
  [/\bone\s+on\s+one\b/g, "1-on-1"],
  [/\bpakistani\b|\bindian\b/g, "desi"],
  [/\bwhatsapp\b|\bphone\b|\bnumber\b|\bcall\b/g, "contact"],
  [/\binsta\b|\big\b|\bw0rldfitnessz0ne\b/g, "instagram"],
  [/\bfee\b|\bfees\b|\bcharges?\b|\bprices?\b|\bpricing\b|\bpackages?\b/g, "cost"],
  [/\bstarve\b|\bstarving\b|\bhunger\b/g, "hungry"],
  [/\bcoaching\b/g, "coach"],
  [/\bworkouts?\b|\bexercises?\b/g, "training"],
  [/\bfoods?\b|\bmeals?\b|\beating\b|\bdiets?\b/g, "meal"],
  [/\bhydrate\b|\bhydration\b|\bdrinking\b/g, "water"],
];

export function normalizeQuestion(text) {
  if (typeof text !== "string") return "";
  let s = text.toLowerCase().trim();
  for (const [pattern, replacement] of SYNONYM_REPLACEMENTS) {
    s = s.replace(pattern, replacement);
  }
  return s
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\-\s\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractTokens(text) {
  const norm = normalizeQuestion(text);
  if (!norm) return [];
  const raw = norm.split(/\s+/);
  const out = [];
  const seen = new Set();
  for (const token of raw) {
    if (!token || token.length < 2 || STOPWORDS.has(token)) continue;
    if (!seen.has(token)) {
      seen.add(token);
      out.push(token);
    }
  }
  return out;
}

function getTrigrams(text) {
  const padded = `  ${text}  `;
  const set = new Set();
  for (let i = 0; i <= padded.length - 3; i++) {
    set.add(padded.slice(i, i + 3));
  }
  return set;
}

function trigramDice(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const setA = getTrigrams(a);
  const setB = getTrigrams(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersect = 0;
  for (const tri of setA) {
    if (setB.has(tri)) intersect++;
  }
  return (2 * intersect) / (setA.size + setB.size);
}

export function computeSimilarity(query, faqItem) {
  if (!query || !faqItem) return 0;
  const normQuery = normalizeQuestion(query);
  if (!normQuery) return 0;

  const candidates = [
    faqItem.question || "",
    ...(Array.isArray(faqItem.aliases) ? faqItem.aliases : []),
  ]
    .map((c) => normalizeQuestion(c))
    .filter(Boolean);

  for (const cand of candidates) {
    if (normQuery === cand) return 1.0;
  }

  for (const cand of candidates) {
    if (
      cand.length >= 10 &&
      (normQuery.includes(cand) || (normQuery.length >= 12 && cand.includes(normQuery)))
    ) {
      return 0.92;
    }
  }

  const queryTokens = extractTokens(query);

  // Fallback for all-stopword short phrases (e.g. "who are you", "how are you")
  if (queryTokens.length === 0) {
    let bestStopwordDice = 0;
    for (const cand of candidates) {
      if (extractTokens(cand).length === 0) {
        const d = trigramDice(normQuery, cand);
        if (d > bestStopwordDice) bestStopwordDice = d;
      }
    }
    return bestStopwordDice >= 0.72 ? Number(bestStopwordDice.toFixed(4)) : 0;
  }

  const queryTokenSet = new Set(queryTokens);

  const keywordSet = new Set(
    (Array.isArray(faqItem.keywords) ? faqItem.keywords : []).flatMap((k) =>
      extractTokens(k)
    )
  );

  let bestScore = 0;

  for (const cand of candidates) {
    const candTokens = extractTokens(cand);
    const candTokenSet = new Set(candTokens);
    const combinedSet = new Set([...candTokenSet, ...keywordSet]);

    let tokenOverlap = 0;
    for (const qt of queryTokenSet) {
      if (candTokenSet.has(qt)) tokenOverlap++;
    }

    let keywordHits = 0;
    for (const qt of queryTokenSet) {
      if (combinedSet.has(qt)) keywordHits++;
    }

    if (keywordHits === 0) continue;

    const queryCoverage = keywordHits / queryTokenSet.size;
    const unionSize = new Set([...queryTokenSet, ...candTokenSet]).size || 1;
    const jaccard = tokenOverlap / unionSize;
    const kwPrecision =
      keywordSet.size > 0
        ? keywordHits / Math.min(keywordSet.size, Math.max(queryTokenSet.size, 3))
        : 0;
    const dice = trigramDice(normQuery, cand);

    const score = Math.min(
      0.99,
      queryCoverage * 0.45 + jaccard * 0.25 + kwPrecision * 0.15 + dice * 0.15
    );

    if (score > bestScore) {
      bestScore = score;
    }
  }

  return Number(bestScore.toFixed(4));
}

export function findBestFaqMatch(query, faqList = SEED_FAQS, threshold = 0.58) {
  if (!query || !Array.isArray(faqList) || faqList.length === 0) return null;
  const normQuery = normalizeQuestion(query);
  if (!normQuery) return null;

  let bestItem = null;
  let bestScore = 0;

  for (const item of faqList) {
    if (!item || !item.question || !item.answer) continue;
    const score = computeSimilarity(query, item);
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && bestScore >= threshold) {
    return { item: bestItem, score: bestScore };
  }

  return null;
}

export function deduplicateAndUpsertFaq(
  faqList = [],
  newQuestion,
  newAnswer,
  metadata = {}
) {
  const cleanList = Array.isArray(faqList) ? [...faqList] : [];
  const trimmedQ = typeof newQuestion === "string" ? newQuestion.trim() : "";
  const trimmedA = typeof newAnswer === "string" ? newAnswer.trim() : "";

  if (!trimmedQ || !trimmedA) {
    return { list: cleanList, entry: null, action: "skipped" };
  }

  let existing = metadata.id
    ? cleanList.find((item) => item && item.id === metadata.id)
    : null;

  if (!existing) {
    const dedupThreshold = metadata.source === "seed" ? 0.88 : 0.65;
    const existingMatch = findBestFaqMatch(trimmedQ, cleanList, dedupThreshold);
    if (existingMatch) {
      existing = existingMatch.item;
    }
  }

  if (existing) {
    const existingNorm = normalizeQuestion(existing.question);
    const incomingNorm = normalizeQuestion(trimmedQ);
    const currentAliases = Array.isArray(existing.aliases) ? [...existing.aliases] : [];
    const incomingAliases = Array.isArray(metadata.aliases) ? metadata.aliases : [];
    const aliasNorms = new Set([existingNorm, ...currentAliases.map(normalizeQuestion)]);

    const updatedAliases = [...currentAliases];
    for (const candidateAlias of [trimmedQ, ...incomingAliases]) {
      const cTrimmed = typeof candidateAlias === "string" ? candidateAlias.trim() : "";
      const cNorm = normalizeQuestion(cTrimmed);
      if (cTrimmed && cNorm && !aliasNorms.has(cNorm)) {
        aliasNorms.add(cNorm);
        updatedAliases.push(cTrimmed);
      }
    }

    const updatedEntry = {
      ...existing,
      aliases: updatedAliases,
      answer: metadata.forceUpdate ? trimmedA : existing.answer,
      updatedAt:
        metadata.forceUpdate || updatedAliases.length !== currentAliases.length
          ? new Date().toISOString()
          : existing.updatedAt,
    };

    const updatedList = cleanList.map((item) =>
      item.id === existing.id ? updatedEntry : item
    );

    return {
      list: updatedList,
      entry: updatedEntry,
      action: metadata.forceUpdate ? "updated" : "reused",
    };
  }

  const newEntry = {
    id: metadata.id || `learned-${Date.now()}`,
    category: metadata.category || "Learned Q&A",
    question: trimmedQ,
    aliases:
      Array.isArray(metadata.aliases) && metadata.aliases.length > 0
        ? metadata.aliases
        : [trimmedQ],
    keywords:
      Array.isArray(metadata.keywords) && metadata.keywords.length > 0
        ? metadata.keywords
        : extractTokens(trimmedQ),
    answer: trimmedA,
    source: metadata.source || "groq_learned",
    updatedAt: metadata.updatedAt || new Date().toISOString(),
  };

  return {
    list: [...cleanList, newEntry],
    entry: newEntry,
    action: "added",
  };
}

export function mergeFaqLists(baseList = [], incomingList = []) {
  let merged = [];
  const combined = [
    ...(Array.isArray(baseList) ? baseList : []),
    ...(Array.isArray(incomingList) ? incomingList : []),
  ];

  for (const item of combined) {
    if (!item || !item.question || !item.answer) continue;
    const res = deduplicateAndUpsertFaq(merged, item.question, item.answer, {
      id: item.id,
      category: item.category,
      aliases: item.aliases,
      keywords: item.keywords,
      source: item.source,
      updatedAt: item.updatedAt,
    });
    merged = res.list;
  }

  return merged;
}

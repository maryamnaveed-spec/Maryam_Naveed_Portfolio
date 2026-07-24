export type SurahMeta = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export type Ayah = {
  number: number; // global ayah number, used for per-ayah audio
  numberInSurah: number;
  text: string;
};

export type SurahDetail = {
  meta: SurahMeta;
  arabicAyahs: Ayah[];
  urduAyahs: Ayah[];
};

const API_BASE = 'https://api.alquran.cloud/v1';
const AUDIO_AYAH_BASE = 'https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal';
const AUDIO_SURAH_BASE = 'https://cdn.islamic.network/quran/audio-surah/128/ar.abdulbasitmurattal';

export async function fetchSurahList(): Promise<SurahMeta[]> {
  // The surah list never changes, so cache it for a full day to avoid
  // re-fetching on every visit.
  const res = await fetch(`${API_BASE}/surah`, { next: { revalidate: 86400 } });
  const json = await res.json();
  return json.data;
}

export async function fetchSurahDetail(number: number): Promise<SurahDetail> {
  // Quran text never changes, so cache each surah for a week once fetched.
  const res = await fetch(`${API_BASE}/surah/${number}/editions/quran-uthmani,ur.jalandhry`, {
    next: { revalidate: 604800 }
  });
  const json = await res.json();
  const [arabicEdition, urduEdition] = json.data;

  return {
    meta: {
      number: arabicEdition.number,
      name: arabicEdition.name,
      englishName: arabicEdition.englishName,
      englishNameTranslation: arabicEdition.englishNameTranslation,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      revelationType: arabicEdition.revelationType
    },
    arabicAyahs: arabicEdition.ayahs,
    urduAyahs: urduEdition.ayahs
  };
}

export function ayahAudioUrl(globalAyahNumber: number) {
  return `${AUDIO_AYAH_BASE}/${globalAyahNumber}.mp3`;
}

export function surahAudioUrl(surahNumber: number) {
  return `${AUDIO_SURAH_BASE}/${surahNumber}.mp3`;
}

// Five frequently recited surahs
export const PUNJ_SURAH_NUMBERS = [
  1,   // Al-Fatihah
  36,  // Ya-Sin
  55,  // Ar-Rahman
  67,  // Al-Mulk
  78   // An-Naba
];
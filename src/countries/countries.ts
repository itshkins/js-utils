import countries from './countries.min.json';

export type CountryKey = string;

export type CountryModel = {
  key: CountryKey
  iso2: string
  titleEn: string
  titlePreciseEn: string
  titleRu: string
  titlePreciseRu: string
  flagUrl: string
  flagData?: string
  isComposite?: true
  isTotal?: true
  isOther?: true
  isUnknown?: true
}

export const lcTitleToCountry: Record<string, CountryModel> = {};
export const keyToCountry: Record<CountryKey, CountryModel> = {};

for (const countryModel of countries as CountryModel[]) {
  lcTitleToCountry[countryModel.titleEn.toLowerCase()] = countryModel;
  lcTitleToCountry[countryModel.titlePreciseEn.toLowerCase()] = countryModel;
  keyToCountry[countryModel.key] = countryModel;
}

export function getCountryKeyByTitleOwner(item: {country: string}) {
  const lcTitle = item.country.toLowerCase();
  return lcTitleToCountry[lcTitle]?.key ?? lcTitle;
}

export function getCountryByKey(countryKey: CountryKey): CountryModel {
  return keyToCountry[countryKey] ?? createCountryModelByKey(countryKey);
}

function createCountryModelByKey(key): CountryModel {
  const title = key.toUpperCase();
  return {
    key,
    iso2: title,
    titleEn: title,
    titlePreciseEn: title,
    titleRu: title,
    titlePreciseRu: title,
    isUnknown: true,
    flagUrl: `/flags/unknown.png`,
  };
}

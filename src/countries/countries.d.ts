export type CountryKey = string;
export type CountryModel = {
    key: CountryKey;
    iso2: string;
    titleEn: string;
    titlePreciseEn: string;
    titleRu: string;
    titlePreciseRu: string;
    flagUrl: string;
    flagData?: string;
    isComposite?: true;
    isTotal?: true;
    isOther?: true;
    isUnknown?: true;
};
export declare const lcTitleToCountry: Record<string, CountryModel>;
export declare const keyToCountry: Record<CountryKey, CountryModel>;
export declare function getCountryKeyByTitleOwner(item: {
    country: string;
}): string;
export declare function getCountryByKey(countryKey: CountryKey): CountryModel;

export const capitalizeFirstLetter = (sentence: string): string => {
    if (sentence.length === 0) return '';
    return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}

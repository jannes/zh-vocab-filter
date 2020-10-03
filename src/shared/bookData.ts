export interface ChapterData {
    title: string;
    words: string[];
}

export interface ChapterFiltered {
    title: string;
    words_study: string[];
    words_not_study: string[];
    words_ignore: string[];
}

export interface BookData {
    title: string;
    vocabulary: ChapterData[];
}

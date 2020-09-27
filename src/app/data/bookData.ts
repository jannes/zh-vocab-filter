export interface ChapterData {
    title: string;
    words: string[];
}

export interface BookData {
    title: string;
    vocabulary: ChapterData[];
}

export type PhraseItem = {
    phrase: string;
    terms: string[]
    last_update: string
    complexity: number
    tags: string[]
    explanations: PhraseExplanation[]
};

type PhraseExplanation = {
    definition: string
    tags: string[]
    code: string[]
    references: string[]
    heat: number
}

export class PhraseModel {
    private phraseMap: Map<string, PhraseItem>;

    constructor() {
        this.phraseMap = new Map<string, PhraseItem>();
    }

    public insert(phrase_item: PhraseItem): void {
        if (this.validate(phrase_item)) {
            this.phraseMap.set(phrase_item.phrase, phrase_item);
        } else {
            console.warn("Invalid data item: " + phrase_item.phrase);
        }
    }

    public insert_list(phrase_items: PhraseItem[]): void {
        for (const phrase_item of phrase_items) {
            this.insert(phrase_item);
        }
    }

    public export_list(): PhraseItem[] {
        const data_items: PhraseItem[] = [];
        for (const data_item of this.phraseMap.values()) {
            data_items.push(data_item);
        }
        return data_items;
    }

    private validate(new_item: PhraseItem): boolean {
        // TODO Is this the best regex?
        const word_pattern = /^[a-zA-Z0-9]+$/;
        if (word_pattern.test(new_item.phrase)) {
            return true;
        }
        console.log("Rejected item: " + new_item.phrase)
        return false;
    }

    // public combine(newItem: PhraseItem): void {
    //     const { word_key, definitions, references } = newItem;

    //     const existingItem: PhraseItem | undefined = this.dataMap.get(word_key);
    //     if (existingItem) {
    //         if (existingItem) {
    //             existingItem.definitions.push(...definitions);
    //             existingItem.references.push(...references);
    //         }
    //     } else {
    //         this.dataMap.set(word_key, newItem);
    //     }
    // }

    public search(word: string): PhraseItem | undefined {
        // TODO Is this how we want to do this?
        // Lower case is most common
        var result = this.phraseMap.get(word.toLowerCase());
        // If not found, try finding normal word
        if (!result) {
            result = this.phraseMap.get(word)
            if (!result) {
                return
            }
        }
        return result;
    }

    public getDataMap(): Map<string, PhraseItem> {
        return this.phraseMap;
    }
}

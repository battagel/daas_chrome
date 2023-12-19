import { PhraseModel } from "../data/datamodel"
import { HTMLEditor } from "./htmleditor"

export class PageProcessor {
    private html_editor: HTMLEditor
    private data_model: PhraseModel

    constructor(data_model: PhraseModel) {
        this.html_editor = new HTMLEditor
        this.data_model = data_model
    }

    async scan() {
        const head_element = document.getElementsByTagName("head");
        const content_element = document.getElementById("content")!;
        let text_elements;

        if (content_element) {
            // Insert styling to head
            this.html_editor.insert_style(head_element[0]);

            // You can add more in the query using a comma e.g. "p, span"
            text_elements = content_element.querySelectorAll(
                "p, h1, h2, h3, h4, h5, h6, li"
            );
        } else {
            console.error("Not on correct page - no 'content' element");
            // TODO: Maybe raise or something
            return undefined;
        }

        for (var i = 0; i < text_elements.length; i++) {
            await this.update_paragraph(text_elements[i]);
        }
    }

    async update_paragraph(para_obj: any) {
        // For searching and replacing of words in the paragraph
        var paragraph: string = para_obj.innerHTML;
        const word_pattern = /[a-zA-Z0-9]/;

        // Tag position pointer. -1 is not on a tag. Else the number is a valid end position of tag
        var tag_ptr = -1;

        var link = false;
        let link_open = /<\/a>/;
        let link_close = /<a.*>/;

        var on_word: boolean = false;
        var end_word: number = 0;
        const len: number = paragraph.length;

        for (var ptr: number = len - 1; ptr >= 0; ptr--) {
            let char = paragraph[ptr];

            if (word_pattern.test(char)) {
                // found a letter
                if (tag_ptr === -1) {
                    if (!on_word) {
                        if (!link) {
                            // starting word
                            on_word = true;
                            end_word = ptr;
                        }
                    }
                }
            } else if (on_word) {
                // found a word!
                // process word
                paragraph = await this.process_word(
                    ptr + 1,
                    end_word,
                    paragraph
                );
                on_word = false;
            }
            if (char === ">") {
                // found beginning of a tag
                tag_ptr = ptr;
            } else if (char == "<") {
                // found end of tag
                if (link_open.test(paragraph.substring(ptr, tag_ptr + 1))) {
                    link = true;
                } else if (
                    link_close.test(paragraph.substring(ptr, tag_ptr + 1))
                ) {
                    link = false;
                }
                tag_ptr = -1;
            }
        }
        // If finishes on an on_word, process it
        if (on_word == true) {
            on_word = false;
            paragraph = await this.process_word(ptr + 1, end_word, paragraph);
        }
        para_obj.innerHTML = paragraph;
    }

    async process_word(
        word_start: number,
        word_end: number,
        para_text: string
    ) {
        // Generate the word using the start and end pointers
        var original_word: string = para_text.substring(word_start, word_end + 1);

        // Search word in hash map
        const data_item = this.data_model.search(original_word);
        if (data_item) {
            para_text =
                para_text.slice(0, word_start) +
                this.html_editor.tooltip(data_item, original_word) +
                para_text.slice(word_end + 1);
        }
        return para_text;
    }
}

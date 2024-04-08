import { PhraseItem } from "../data/datamodel"

export class HTMLEditor {

    public tooltip(phrase_item: PhraseItem, original_word: string): string {
        const number_explanations = phrase_item.explanations.length

        // if (phrase_item.category === "gen") {
        //     phrase_item.word_key = this.capitalizeWords(phrase_item.word_key);
        // }

        var tooltip_text =
            "<span class='tooltiptext'><b>" +
            phrase_item.phrase +
            "</b>" +
            " - " +
            number_explanations +
            " potential meaning(s)";

        for (const explanation of phrase_item.explanations) {
            // Add definitions, authoor and references
            if (explanation.definition) {
                tooltip_text += "<hr>" + explanation.definition + "<br>";
            }

            if (explanation.author) {
                tooltip_text += "<i>Author: " + explanation.author + "</i><br>";
            }

            if (explanation.tags) {
                for (var i = 0; i < explanation.tags.length; i++) {
                    explanation.tags[i] = "<code>" + explanation.tags[i] + "</code>";
                }
            }

            if (explanation.code) {
                for (var i = 0; i < explanation.code.length; i++) {
                    explanation.code[i] = "<code>" + explanation.code[i] + "</code>";
                }
            }

            var formatted_links = "<ul>";
            for (var j = 0; j < explanation.references.length; j++) {
                formatted_links += "<li>" + explanation.references[j] + "</li>";
            }
            formatted_links += "</ul>";

            tooltip_text += formatted_links + "";
        }
        tooltip_text += "</span>";

        return (
            "<div class='tooltip'>" + original_word + tooltip_text + "</div>"
        );
    }

    private capitalizeWords(word: string) {
        var word_array = word.split(" ");
        var capital_word_array = word_array.map((element: string) => {
            return (
                element.charAt(0).toUpperCase() +
                element.substring(1).toLowerCase()
            );
        });
        return capital_word_array.join(" ");
    }

    public insert_style(element: HTMLHeadElement) {
        // Append a custom styling into the header styles
        // Way better to append a child rather than replace the whole head
        const styleElement = document.createElement('style');

        const raw_css = `
            .tooltip {
                    position: relative;
                    display: inline-block;
                    border-bottom: 3px dotted #01A986;
                }

            .tooltip .tooltiptext {
                font-family: Arial;
                visibility: hidden;
                background-color: #ffffff;
                min-width: 300px;
                color: black;
                text-align: left;
                border-radius: 6px;
                border: 1px solid #01A986;
                padding: 10px;
                position: absolute;
                z-index: 9999999;
                transition: visibility 0s linear 300ms, opacity 300ms;
                top: 150%;
                left: 50%;
                transform: translateX(-25%);
                box-shadow: 0px 1px 6px 0px rgba(1, 169, 134, 0.32);
                font-size: 14px;
            }

            .tooltip .tooltiptext::after {
                content: "";
                position: absolute;
                bottom: 100%;
                left: 25%;
                margin-left: -5px;
                border-width: 8px;
                border-style: solid;
                border-color: transparent transparent #01A986 transparent;
            }

            .tooltip:hover .tooltiptext {
                visibility: visible;
            }
        `
        styleElement.innerText = raw_css
        element.appendChild(styleElement)
    }
}

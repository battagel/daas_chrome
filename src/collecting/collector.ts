import { PhraseModel } from "../data/datamodel";


export class Collector {
    private api_url: string
    public phrase_model: PhraseModel

    constructor(api_url: string) {
        this.api_url = api_url
        this.phrase_model = new PhraseModel
    }

    async collect(): Promise<PhraseModel> {
        try {
            const response = await fetch(this.api_url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const list_of_json_phrases: any = await response.json();

            // Create a new instance of PhraseModel and insert the list of PhraseItems
            const phraseModel = new PhraseModel();
            phraseModel.insert_list(list_of_json_phrases.return);

            return phraseModel;
        } catch (error) {
            console.error('Error collecting data:', error);
            throw error; // You might want to handle errors more gracefully
        }
    }
}

import { PhraseItem, PhraseModel } from "../data/datamodel";


export interface Database {
	get(key: string, value: string): Promise<PhraseItem | undefined>;
	get_keys(): Promise<string[]>;
	get_keys_by_type(types: string[]): Promise<PhraseModel>;
	get_key_count(): Promise<number>;
	bulk_insert(data_model: PhraseModel): Promise<void>;
	clear_db(): Promise<void>;
}

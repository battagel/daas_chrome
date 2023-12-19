import Dexie from "dexie";
import { PhraseModel, PhraseItem } from "../data/datamodel";

export class DexieDatabase extends Dexie {
    data_table: Dexie.Table<PhraseItem, string>; // 'string' is the type of the primary key

    constructor() {
        super("PhraseDatabase");

        this.version(1).stores({
            data_table: "phrase",
        });

        this.data_table = this.table("data_table");
    }

    // Get a single entry
    public async get(key: string, value: string): Promise<PhraseItem | undefined> {
        return this.data_table.where(key).equals(value).first();
    }

    // Get all keys inside of database
    public async get_keys(): Promise<string[]> {
        const keys = await this.data_table.orderBy("phrase").keys();
        return keys as string[];
    }

    // Get all keys given list of types
    public async get_data_items_by_type(categories: string[]): Promise<PhraseModel> {
        const db_data = await this.data_table
            .where("category")
            .anyOf(categories)
            .toArray();
        let data_model: PhraseModel = new PhraseModel()
        data_model.insert_list(db_data)
        return data_model;
    }

    // Get all keys given list of types
    public async get_all(): Promise<PhraseModel> {
        const db_data = await this.data_table.toArray();
        let phrase_model: PhraseModel = new PhraseModel()
        phrase_model.insert_list(db_data)
        return phrase_model;
    }

    public async get_key_count(): Promise<number> {
        return this.data_table.count();
    }

    public async bulk_insert(data_model: PhraseModel): Promise<void> {
        await this.data_table.bulkPut(data_model.export_list())
    }

    public async clear_db(): Promise<void> {
        this.data_table.clear();
    }
}

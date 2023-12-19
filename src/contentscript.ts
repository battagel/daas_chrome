import { DexieDatabase } from './database/dexie';
import { PageProcessor } from "./processing/pageprocessor";
import { Collector } from "./collecting/collector";
import { PhraseModel } from './data/datamodel';

// TODO: This doesnt work on Firefox
chrome.storage.sync.get(["categories"], function (options) {

	let db: DexieDatabase = new DexieDatabase();

	const api_url = "http://127.0.0.1:8080/phrase"

	let collector: Collector = new Collector(api_url);

	const start_time = Date.now()

	// Check if DB is already populated with
	db.get_key_count().then((keys_count: number) => {
		if (keys_count > 0) {
			console.log("Cache already populated")
			// Query from DB
			db.get_all().then((phrase_model: PhraseModel) => {
				let page_processor = new PageProcessor(phrase_model);
				page_processor.scan()
				const end_time = Date.now()
				const exec_time = end_time - start_time
				console.log("DaaS completed in " + exec_time + " ms")
			})
		} else {
			console.log("No cache found")
			// Query from API
		    collector.collect().then((phrase_model: PhraseModel) => {
				// Do not requery the database. Use the data from the scrape
				let page_processor = new PageProcessor(phrase_model);
				page_processor.scan()

				// Saved new data to database
				db.bulk_insert(phrase_model)
				const end_time = Date.now()
				const exec_time = end_time - start_time
				console.log("DaaS completed in " + exec_time + " ms")
			})

		}
	});
});

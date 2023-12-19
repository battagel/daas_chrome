import { Chip, Group, Text } from "@mantine/core";
import { useRef, useEffect, useState } from "react";

export default function Options() {
	const [value, setValue] = useState<Array<string>>([]);
	const isInitialMount = useRef(0);

	useEffect(() => {
		chrome.storage.sync.get(["categories"], function (result) {
			setValue(result["categories"]);
		});
	}, []);
	useEffect(() => {
		// Store data whenever value changes
		if (isInitialMount.current < 3) {
			// This is odd but allow it. There are 3 changes to this variable before the loading is complete so only sense changes after these
			console.log("Not reloading");
			isInitialMount.current += 1;
			console.log(isInitialMount);
		} else {
			console.log("reloading");
			chrome.storage.sync.set({ categories: value }, function () {
				console.log("Data stored of value " + value);
				chrome.tabs.query(
					{ active: true, currentWindow: true },
					function (tabs: any) {
						chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
					}
				);
			});
		}
	}, [value]);

	return (
		<div className="options">
			<Text size="sm">
				Choose what you want to highlight
			</Text>
			<Chip.Group
				multiple
				value={value}
				onChange={setValue}
			>
				<Group position="left" style={{ paddingTop: "5px", gap: "0.2rem" }}>
					<Chip color="teal" value="general">General</Chip>
					<Chip color="teal" value="hpe">HPE</Chip>
				</Group	>
			</Chip.Group>
		</div>
	);
}

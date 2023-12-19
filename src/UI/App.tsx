import {
    AppShell,
    Button,
    Center,
    MantineProvider,
    Title,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import Options from "./components/Options";

export default function App() {
    const theme = useMantineTheme();

    const helpButtonClick = () => {
        window.open('https://matthewbattagel.co.uk/#/help/antonium', '_blank');
    };

    return (
        <MantineProvider
            theme={{
                colorScheme: "light",
            }}
        >
            <AppShell
                padding="md"
                styles={(theme) => ({
                    main: {
                        backgroundColor:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[8]
                                : theme.colors.gray[0],
                    },
                })}
                sx={{ width: "100%", height: "100%" }}
            >
                <Center>
                    <div
                        style={{
                            backgroundColor: "#00B388",
                            padding: "10px",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: theme.colors.gray[0],
                                padding: "10px",
                            }}
                        >
                            <div
                                style={{ display: "flex", marginBottom: "5px" }}
                            >
                                <Title order={1}>DaaS</Title>
                                <Tooltip withArrow label="Help">
                                    <Button
                                        radius="xl"
                                        size="xs"
                                        color="teal"
                                        compact
                                        style={{ marginLeft: "auto", order: 2 }}
                                        onClick={helpButtonClick}
                                    >
                                        ?
                                    </Button>
                                </Tooltip>
                            </div>
                            <Options />
                        </div>
                    </div>
                </Center>
            </AppShell>
        </MantineProvider>
    );
}

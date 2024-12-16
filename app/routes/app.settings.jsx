import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";

import db from "../db.server";

export async function loader() {
  // get data from database
  let settings = await db.setting.findFirst();

  console.log("settings------------>", settings);

  return json(settings);
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const settings = Object.fromEntries(formData);

    await db.setting.upsert({
      where: { id: 1 },
      update: { name: settings.name, description: settings.description },
      create: {
        id: 1,
        name: settings.name,
        description: settings.description,
      },
    });

    return json({ success: true, settings });
  } catch (err) {
    console.error("Error in action:", err);
    return json({ success: false, error: err.message }, { status: 500 });
  }
}

export default function SettingsPage() {
  const settings = useLoaderData();
  const [formState, setFormState] = useState(settings);
  return (
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update app settings and preferences.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
              <BlockStack gap="400">
                <TextField
                  label="App name"
                  name="name"
                  value={formState?.name}
                  onChange={(value) =>
                    setFormState({ ...formState, name: value })
                  }
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formState?.description}
                  onChange={(value) =>
                    setFormState({ ...formState, description: value })
                  }
                />
                <Button submit={true}>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}

import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { generateUniqueAppId } from "@/utils/app-id-generator"
import { SecretVaultWrapper } from "secretvaults"

// Nillion organization configuration
const orgConfig = {
  orgCredentials: {
    secretKey: process.env.NILLION_ORG_SECRET_KEY,
    orgDid: process.env.NILLION_ORG_DID,
  },
  nodes: [
    {
      url: "https://nildb-nx8v.nillion.network",
      did: "did:nil:testnet:nillion1qfrl8nje3nvwh6cryj63mz2y6gsdptvn07nx8v",
    },
    {
      url: "https://nildb-p3mx.nillion.network",
      did: "did:nil:testnet:nillion1uak7fgsp69kzfhdd6lfqv69fnzh3lprg2mp3mx",
    },
    {
      url: "https://nildb-rugk.nillion.network",
      did: "did:nil:testnet:nillion1kfremrp2mryxrynx66etjl8s7wazxc3rssrugk",
    },
  ],
}

// Feedback schema definition
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Feedback Widget Data",
  type: "array",
  items: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        format: "uuid",
        coerce: true,
      },
      rating: {
        type: "string",
      },
      message: {
        type: "string",
      },
      url: {
        type: "string",
      },
      timestamp: {
        type: "string",
      },
      browser: {
        type: "string",
      },
      platform: {
        type: "string",
      },
      language: {
        type: "string",
      },
      email: {
        type: "object",
        properties: {
          "%share": {
            type: "string",
          },
        },
        required: ["%share"],
      },
      screenshot: {
        type: "object",
        properties: {
          "%share": {
            type: "string",
          },
        },
        required: ["%share"],
      },
      userAgent: {
        type: "object",
        properties: {
          "%share": {
            type: "string",
          },
        },
        required: ["%share"],
      },
      screenSize: {
        type: "object",
        properties: {
          "%share": {
            type: "string",
          },
        },
        required: ["%share"],
      },
      referrer: {
        type: "object",
        properties: {
          "%share": {
            type: "string",
          },
        },
        required: ["%share"],
      },
    },
    required: ["_id", "message", "timestamp"],
  },
}

// Fallback schema ID in case of errors
const FALLBACK_SCHEMA_ID = "22d4f7b3-65fe-4fe4-aab8-fe859ec1dc7d"

export async function POST(request: Request) {
  try {
    // Get the current user session
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate a unique app ID
    const appId = await generateUniqueAppId(supabase)

    // Create schema using SecretVaultWrapper
    let schemaId = FALLBACK_SCHEMA_ID
    try {
      const org = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials)
      await org.init()

      // Create a new collection schema
      const newSchema = await org.createSchema(schema, "Feedback Widget Data")
      console.log("📚 New Schema:", newSchema)

      // Extract schema ID from the response
      if (newSchema && newSchema.length > 0 && newSchema[0].schemaId) {
        schemaId = newSchema[0].schemaId
      }
    } catch (schemaError) {
      console.error("❌ Failed to create schema:", schemaError)
      // Continue with fallback schema ID
    }

    return NextResponse.json({
      success: true,
      appId: appId,
      schemaId: schemaId,
      message: "New app ID and schema generated successfully",
    })
  } catch (error) {
    console.error("Error creating app:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create app" },
      { status: 500 },
    )
  }
}

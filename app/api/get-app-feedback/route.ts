import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
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

export async function GET(request: Request) {
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

    // Get the schema ID from the URL query parameters
    const url = new URL(request.url)
    const schemaId = url.searchParams.get("schemaId")

    if (!schemaId) {
      return NextResponse.json({ error: "Schema ID is required" }, { status: 400 })
    }

    // Log the schema ID to the console
    console.log("Fetching feedback for schema ID:", schemaId)

    try {
      // Initialize the SecretVaultWrapper with the schema ID
      const collection = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials, schemaId)
      await collection.init()

      // Read data from the nodes
      const dataRead = await collection.readFromNodes({})
      console.log("📚 total records:", dataRead.length)
      console.log("📚 Read records:", dataRead)

      // Return the read records in the API response
      return NextResponse.json({
        success: true,
        totalRecords: dataRead.length,
        records: dataRead,
      })
    } catch (error) {
      console.error("❌ Failed to use SecretVaultWrapper:", error.message)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to read feedback data" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error getting app feedback:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get app feedback" },
      { status: 500 },
    )
  }
}

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

    // Parse the request body
    const body = await request.json()
    const { schemaId } = body

    if (!schemaId) {
      return NextResponse.json({ error: "Schema ID is required" }, { status: 400 })
    }

    // Log the schema ID to the console
    console.log("Fetching feedback for schema ID:", schemaId)

    try {
      // Initialize the SecretVaultWrapper with the schema ID
      const collection = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials, schemaId)
      await collection.init()

      // Read data from the nodes
      const dataRead = await collection.readFromNodes({})
      console.log("📚 total records:", dataRead.length)
      console.log("📚 Read records:", dataRead)

      // Return the read records in the API response
      return NextResponse.json({
        success: true,
        totalRecords: dataRead.length,
        records: dataRead,
      })
    } catch (error) {
      console.error("❌ Failed to use SecretVaultWrapper:", error.message)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to read feedback data" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error getting app feedback:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get app feedback" },
      { status: 500 },
    )
  }
}

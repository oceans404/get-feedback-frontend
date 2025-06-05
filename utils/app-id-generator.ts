/**
 * Generates a random app ID with the format: xxxx-xxxx-xxxx
 * Where x is a letter or number (excluding ambiguous characters)
 */
export function generateAppId(): string {
  // Characters to use (excluding ambiguous ones like 0/O, 1/I/l, etc.)
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"

  // Generate three groups of four characters
  const generateGroup = () => {
    let result = ""
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Format: xxxx-xxxx-xxxx
  return `${generateGroup()}-${generateGroup()}-${generateGroup()}`
}

/**
 * Checks if an app ID already exists in the database
 */
export async function isAppIdUnique(supabase: any, appId: string): Promise<boolean> {
  const { data } = await supabase.from("app_ids").select("id").eq("app_id", appId).single()

  return !data // If no data is found, the ID is unique
}

/**
 * Generates a unique app ID that doesn't exist in the database
 */
export async function generateUniqueAppId(supabase: any): Promise<string> {
  let appId = generateAppId()
  let isUnique = await isAppIdUnique(supabase, appId)

  // In the unlikely event of a collision, generate a new ID
  // Set a maximum number of attempts to prevent infinite loops
  let attempts = 0
  const maxAttempts = 10

  while (!isUnique && attempts < maxAttempts) {
    appId = generateAppId()
    isUnique = await isAppIdUnique(supabase, appId)
    attempts++
  }

  if (!isUnique) {
    throw new Error("Failed to generate a unique app ID after multiple attempts")
  }

  return appId
}

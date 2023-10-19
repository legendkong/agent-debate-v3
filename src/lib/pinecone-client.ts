import { Pinecone } from '@pinecone-database/pinecone'
import { env } from './config'
import { delay } from './utils'

let pineconeClientInstance: Pinecone | null = null

const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
  environment: env.PINECONE_ENVIRONMENT
})

// Create pineconeIndex if it doesn't exist
async function createIndex(indexName: string) {
  try {
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536,
      metric: 'cosine'
    })
    console.log(
      `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    )
    await delay(env.INDEX_INIT_TIMEOUT)
    console.log('Index created !!')
  } catch (error) {
    console.error('error ', error)
    throw new Error('Index creation failed')
  }
}

// Initialize index and ready to be accessed.
async function initPineconeClient() {
  try {
    const pinecone = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
      environment: env.PINECONE_ENVIRONMENT
    })
    const indexName = env.PINECONE_INDEX_NAME

    const existingIndexes = await pinecone.listIndexes()

    if (!existingIndexes.includes(indexName)) {
      createIndex(indexName)
    } else {
      console.log('Your index already exists. nice !!')
    }

    return pinecone
  } catch (error) {
    console.error('error', error)
    throw new Error('Failed to initialize Pinecone Client')
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient()
  }

  return pineconeClientInstance
}

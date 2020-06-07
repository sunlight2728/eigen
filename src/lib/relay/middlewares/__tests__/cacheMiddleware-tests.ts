jest.mock("../../../NativeModules/GraphQLQueryCache")
import * as _cache from "../../../NativeModules/GraphQLQueryCache"

const cache: jest.Mocked<typeof _cache> = _cache as any

import { cacheMiddleware, GraphQLRequest } from "../cacheMiddleware"

describe("cacheMiddleware", () => {
  const operation = {
    id: "SomeQueryID",
    operationKind: "query",
    name: "SomeQueryName",
    text: null,
    metadata: {},
  }
  const variables = {
    id: "banksy",
  }
  const cacheConfig = {
    force: false,
  }
  const request: GraphQLRequest = {
    operation,
    variables,
    cacheConfig,
    fetchOpts: {},
  }
  const response = { json: { artist: { name: "Banksy" } }, status: 200, statusText: "OK" }

  beforeEach(() => {
    cache.clear.mockClear()
    cache.clearAll.mockClear()
    cache.get.mockClear()
    cache.set.mockClear()
  })

  const mockedNext = () => {
    return new Promise(resolve => {
      resolve(response)
    })
  }

  describe("without cached data", () => {
    beforeEach(() => {
      cache.get.mockImplementation(() => {
        return Promise.resolve(null)
      })
    })

    it("performs a fetch", async () => {
      const data = await cacheMiddleware()(mockedNext)(request)
      expect(data).toEqual(response)
    })

    it("caches the fetched data", async () => {
      await cacheMiddleware()(mockedNext)(request)

      expect(cache.set.mock.calls.length).toEqual(2)
      expect(cache.set.mock.calls[0][0]).toEqual(operation.id)
    })

    describe("a response with errors", () => {
      it("clears the cache and throws an error", async () => {
        const mockedErrorsNext = () => {
          return new Promise(resolve => {
            resolve({
              ...response,
              json: {
                ...response.json,
                errors: [{ errorCode: 1234 }],
              },
            })
          })
        }

        let error: string = ""
        try {
          await cacheMiddleware()(mockedErrorsNext)(request)
        } catch (e) {
          error = e.message
        }
        expect(error).toMatchInlineSnapshot(`
          "
          errors: [
            {
              \\"errorCode\\": 1234
            }
          ]
          queryID: SomeQueryID
          variables: {
            \\"id\\": \\"banksy\\"
          }
          "
        `)

        // 1 cache call means we set request as in-flight.
        expect(cache.set).toHaveBeenCalledTimes(1)
        expect(cache.set).toHaveBeenCalledWith(operation.id, variables, null)

        expect(cache.clear).toHaveBeenCalledWith(operation.id, variables)
      })
    })
  })

  describe("a 404 response from metaphysics", () => {
    beforeAll(() => {
      // @ts-ignore
      __DEV__ = false
    })
    afterAll(() => {
      // @ts-ignore
      __DEV__ = true
    })
    it(`will be retried if the query id was not recognized by MP`, async () => {
      let rejected = false
      let retried = false

      const mockedErrorsNext = (req: any) => {
        if (JSON.parse(req.fetchOpts.body).documentID) {
          rejected = true
          return Promise.reject(new Error("Unable to serve persisted query with ID"))
        } else {
          retried = true
          return Promise.resolve({
            status: 200,
            json: { data: { success: true }, errors: undefined },
          })
        }
      }
      await expect(cacheMiddleware()(mockedErrorsNext)(request)).resolves.toMatchObject({
        json: { data: { success: true } },
      })

      expect(rejected).toBe(true)
      expect(retried).toBe(true)
    })

    it(`will be not be retried if failure was something else`, async () => {
      let rejected = false
      let retried = false

      const mockedErrorsNext = (req: any) => {
        if (JSON.parse(req.fetchOpts.body).documentID) {
          rejected = true
          return Promise.reject(new Error("something unrecognized went wrong"))
        } else {
          retried = true
          return Promise.resolve({
            status: 200,
            json: { data: { success: true }, errors: undefined },
          })
        }
      }

      await expect(cacheMiddleware()(mockedErrorsNext)(request)).rejects.toEqual(
        new Error("something unrecognized went wrong")
      )

      expect(rejected).toBe(true)
      expect(retried).toBe(false)
    })
  })

  describe("a 500 response from metaphysics", () => {
    it("clears the cache and throws an error", async () => {
      const mockedErrorsNext = () => {
        return new Promise(resolve => {
          resolve({
            status: 500,
            statusText: "some weird 500 HTML page or something",
          })
        })
      }

      let error: string = ""
      try {
        await cacheMiddleware()(mockedErrorsNext)(request)
      } catch (e) {
        error = e.message
      }
      expect(error).toMatchInlineSnapshot(`
        "
        errors: \\"some weird 500 HTML page or something\\"
        queryID: SomeQueryID
        variables: {
          \\"id\\": \\"banksy\\"
        }
        "
      `)

      // 1 cache call means we set request as in-flight.
      expect(cache.set).toHaveBeenCalledTimes(1)
      expect(cache.set).toHaveBeenCalledWith(operation.id, variables, null)

      expect(cache.clear).toHaveBeenCalledWith(operation.id, variables)
    })
  })

  describe("with cached data", () => {
    it("does not perform a fetch by default", async () => {
      cache.get.mockImplementation(() => Promise.resolve(JSON.stringify(response)))
      expect(await cacheMiddleware()(mockedNext)(request)).toEqual(response)
    })

    it("does perform a fetch when forced", async () => {
      const aRequest: GraphQLRequest = {
        operation,
        variables,
        cacheConfig: { force: true },
        fetchOpts: {},
      }
      expect(await cacheMiddleware()(mockedNext)(aRequest)).toEqual(response)
    })

    it("clears the cache after a mutation", async () => {
      const mutation: GraphQLRequest = {
        operation: {
          id: "SomeMutationID",
          operationKind: "mutation",
          text: null,
          metadata: {},
          name: "SomeMutationName",
        },
        variables,
        cacheConfig,
        fetchOpts: {},
      }
      await cacheMiddleware()(mockedNext)(mutation)
      expect(cache.clearAll).toHaveBeenCalled()
    })

    it("ignores clearing the cache for allowed mutations", async () => {
      const mutation: GraphQLRequest = {
        operation: {
          id: "ArtworkMarkAsRecentlyViewedQueryID",
          operationKind: "mutation",
          text: null,
          metadata: {},
          name: "ArtworkMarkAsRecentlyViewedQuery",
        },
        variables,
        cacheConfig,
        fetchOpts: {},
      }
      await cacheMiddleware()(mockedNext)(mutation)
      expect(cache.clearAll).not.toHaveBeenCalled()
    })
  })
})

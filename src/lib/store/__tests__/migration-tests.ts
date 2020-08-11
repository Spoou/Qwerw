import { migrate } from "../migration"

describe(migrate, () => {
  it("leaves an object untouched if there are no migrations pending", () => {
    const result = migrate({
      state: {
        version: 1,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: s => {
          s.value = "modified"
        },
      },
    })

    expect((result as any).value).toBe("untouched")
    expect(result.version).toBe(1)
  })

  it("applies a migration if there is one pending", () => {
    const result = migrate({
      state: {
        version: 0,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: s => {
          s.value = "modified"
        },
      },
    })

    expect((result as any).value).toBe("modified")
    expect(result.version).toBe(1)
  })

  it("applies many migrations if there are many pending", () => {
    const result = migrate({
      state: {
        version: 0,
      },
      toVersion: 4,
      migrations: {
        [0]: s => {
          s.zero = true
        },
        [1]: s => {
          s.one = true
        },
        [2]: s => {
          s.two = true
        },
        [3]: s => {
          s.three = true
        },
        [4]: s => {
          s.four = true
        },
        [5]: s => {
          s.five = true
        },
      },
    })

    expect((result as any).zero).toBe(undefined)
    expect((result as any).one).toBe(true)
    expect((result as any).two).toBe(true)
    expect((result as any).three).toBe(true)
    expect((result as any).four).toBe(true)
    expect((result as any).five).toBe(undefined)
    expect(result.version).toBe(4)
  })

  it("throws an error if there is no valid version", () => {
    expect(() => {
      migrate({
        state: {
          // @ts-ignore
          version: "0",
        },
        toVersion: 1,
        migrations: {
          [1]: s => {
            s.zero = true
          },
        },
      })
    }).toThrowErrorMatchingInlineSnapshot(`"Bad state.version {\\"version\\":\\"0\\"}"`)
  })

  it("throws an error if there is no valid migration", () => {
    expect(() => {
      migrate({
        state: {
          version: 0,
        },
        toVersion: 1,
        migrations: {
          [0]: s => {
            s.zero = true
          },
        },
      })
    }).toThrowErrorMatchingInlineSnapshot(`"No migrator found for app version 1"`)
  })

  it("guarantees that the version number ends up correct", () => {
    const result = migrate({
      state: {
        version: 0,
        value: "untouched",
      },
      toVersion: 1,
      migrations: {
        [1]: s => {
          s.value = "modified"
          s.version = 5
        },
      },
    })

    expect((result as any).value).toBe("modified")
    expect(result.version).toBe(1)
  })
})

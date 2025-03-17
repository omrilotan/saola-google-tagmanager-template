export const permissions = [
  {
    instance: {
      key: {
        publicId: "access_globals",
        versionId: "1"
      },
      param: [
        {
          key: "keys",
          value: {
            type: 2,
            listItem: [
              {
                type: 3,
                mapKey: ["key", "read", "write", "execute"].map((key) => ({
                  type: 1,
                  [typeof key]: key
                })),
                mapValue: [
                  [1, "SaolaParams"],
                  [8, true],
                  [8, true],
                  [8, false]
                ].map(([type, value]) => ({ type, [typeof value]: value }))
              }
            ]
          }
        }
      ]
    }
  },
  {
    instance: {
      key: {
        publicId: "inject_script",
        versionId: "1"
      },
      param: [
        {
          key: "urls",
          value: {
            type: 2,
            listItem: [
              {
                type: 1,
                string: "https://www.saola.ai/sdk/*"
              }
            ]
          }
        }
      ]
    }
  }
].map(({ instance }) => ({
  instance,
  clientAnnotations: {
    isEditedByUser: true
  },
  isRequired: true
}));

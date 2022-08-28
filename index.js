class Validator {
  constructor({ schema, values }) {
    // Constructor
    this.schema = schema
    this.values = values
    this.isValid = true
    this.errors = {}
  }
  check(key, schemakey, value) {
    switch (schemakey) {
      case "required":
        if (
          value === "" ||
          value === null ||
          value === undefined ||
          value.length === 0 ||
          Object.keys(this.values).includes(key) === false
        ) {
          this.isValid = false
          this.errors[key] = `${key} is required`
        }
        break
      case "type":
        switch (this.schema[key][schemakey]) {
          case "string":
            if (/^[a-zA-Z ]+$/.test(value) === false) {
              this.isValid = false
              this.errors[key] = `Only alphabets allowed for ${key}.`
            }
            break
          case "number":
            if (/^[0-9]+$/.test(value) === false) {
              this.isValid = false
              this.errors[key] = `Only digits allowed for ${key}.`
            }
            break
        }
        break
      case "lt":
        console.log(value, this.schema[key].lt)
        if (this.schema[key].lt <= parseInt(value)) {
          this.isValid = false
          this.errors[key] = `${key} should be less than ${this.schema[key].lt}.`
        }
        break
      case "lte":
        console.log(value, this.schema[key].lte + 1)
        if (this.schema[key].lte + 1 < parseInt(value)) {
          this.isValid = false
          this.errors[key] = `${key} should be less than or equal to ${this.schema[key].lte}.`
        }
        break
      case "gt":
        console.log(value, this.schema[key].gt)
        if (this.schema[key].gt >= parseInt(value)) {
          this.isValid = false
          this.errors[key] = `${key} should be greater than ${this.schema[key].gt}.`
        }
        break
      case "gte":
        console.log(value, this.schema[key].gte)
        if (this.schema[key].gte + 1 >= parseInt(value)) {
          this.isValid = false
          this.errors[key] = `${key} should be greater than or equal to ${this.schema[key].gte}.`
        }
        break
      case "customRegExp":
        if (this.schema[key].customRegExp.test(value) === false) {
          this.isValid = false
          this.errors[key] = `${key} is invalid.`
        }
    }
  }
  validate() {
    const keys = Object.keys(this.schema)
    const length = keys.length
    for (let i = 0; i < length; i++) {
      const key = keys[i]
      if (this.schema[key].type === "object") {
        const oldSchema = this.schema
        const oldValues = this.values
        const oldErrors = this.errors
        this.schema = this.schema[key].schema
        this.values = this.values[key]
        this.errors = {}
        this.validate()
        this.schema = oldSchema
        this.values = oldValues
        this.errors = { ...oldErrors, [key]: this.errors }
      } else if (this.schema[key].type === "array") {
        this.errors[key] = []
        for (let k = 0; k < this.values[key].length; k++) {
          const oldSchema = this.schema
          const oldValues = this.values
          const oldErrors = this.errors
          this.schema = this.schema[key].schema
          this.values = this.values[key][k]
          this.errors = {}
          this.validate()
          this.schema = oldSchema
          this.values = oldValues
          oldErrors[key].push(this.errors)
          this.errors = oldErrors
        }
      } else {
        const schemaKeys = Object.keys(this.schema[key])
        const schemaLength = Object.keys(this.schema[key]).length
        for (let j = 0; j < schemaLength; j++) {
          const schemakey = Object.keys(this.schema[key])[j]
          const value = this.values[key]
          this.check(key, schemakey, value)
        }
      }
    }
    return this
  }
}
export default Validator
// const schema = {
//   name: { type: "string", required: true },
//   age: { type: "number", required: true, gte: 13 },
//   klavaro: { required: true, customRegExp: /^klavaro$/ },
//   fasd: { required: true },
//   hobby: {
//     type: "object",
//     schema: {
//       name: { type: "string", required: true },
//       funLevel: { type: "number", required: true },
//       lvlTwo: {
//         type: "object",
//         schema: {
//           key1: { type: "number", required: true },
//           key2: { type: "string", required: true }
//         }
//       }
//     }
//   },
//   friends: { type: "array", schema: { name: { type: "string", required: true } } }
// }
// const values = {
//   klavaro: "klavaro",
//   name: "12",
//   age: "13",
//   hobby: { name: "123", funLevel: "abc", lvlTwo: { key1: "hello", key2: "123" } },
//   friends: [{ name: "12" }, { name: "" }]
// }
// const validator = new Validator({ schema, values })
// console.log(validator)
// validator.validate()
// console.log(validator.errors)

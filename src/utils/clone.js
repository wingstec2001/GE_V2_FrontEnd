function deepClone(target) {
  let result
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = []
      for (let i = 0; i < target.length; i += 1) {
        result.push(deepClone(target[i]))
      }
    } else if (target === null) {
      result = null
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      result = {}
      Object.keys(target).forEach(key => {
        result[key] = deepClone(target[key])

        return result[key]
      })
    }
  } else {
    result = target
  }

  return result
}

export default deepClone

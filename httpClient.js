export class HttpClient {
  constructor(baseURL = '', headers = {}) {
    this.headers = headers
    if (baseURL) this.baseURL = baseURL
  }

  processHeaders(headers, params) {
    if (!headers['Content-Type']) {
      if (params instanceof ArrayBuffer) {
        headers['Content-Type'] = 'application/octet-stream'
      } else {
        headers['Content-Type'] = 'application/json'
      }
    }
  }

  async rq(method, url, params, headers, options = {}) {
    let timeoutId
    const controller = new AbortController()
    if (options.timeout) {
      timeoutId = setTimeout(() => controller.abort(), options.timeout)
    }

    this.processHeaders(headers, params)

    const fetchParams = { method, headers, signal: controller.signal }

    if (method === 'POST' || method === 'PUT') {
      if (params instanceof ArrayBuffer) {
        fetchParams.body = params
      } else {
        fetchParams.body =
          headers['Content-Type'] === 'application/json'
            ? JSON.stringify(params)
            : this.strParams(params)
      }
    } else {
      if (Object.keys(params).length) url += '?' + new URLSearchParams(params)
    }

    const response = await fetch(
      this.baseURL ? this.baseURL + url : url,
      fetchParams
    )
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    let r = {
      statusCode: response.status,
      headers: response.headers,
    }
    if (options.blob) {
      r.data = await response.blob()
    } else {
      const t = response.headers.get('content-type') ?? ''
      r.data = t.startsWith('application/json')
        ? await response.json()
        : await response.text()
    }
    return r
  }
  async get(url, params = {}, headers = {}, options = {}) {
    return await this.rq('GET', url, params, headers, options)
  }
  async post(url, params = {}, headers = {}, options = {}) {
    return await this.rq('POST', url, params, headers, options)
  }
  async delete(url, params = {}, headers = {}, options = {}) {
    return await this.rq('DELETE', url, params, headers, options)
  }
  strParams(params) {
    let str = ''
    for (let k in params) str = str + k + '=' + params[k] + '&'
    return str.length ? str.slice(0, -1) : ''
  }
}
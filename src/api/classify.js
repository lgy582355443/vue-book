import { request } from "./request"

export function classifyListApi() {
  return request({
    url: `/api/classify/list`,
    method: 'get',
  })
}


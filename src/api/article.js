import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/article',
    method: 'post',
    data
  })
}

export function one(id) {
  return request({
    url: 'api/article/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: 'api/article/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/article',
    method: 'put',
    data
  })
}

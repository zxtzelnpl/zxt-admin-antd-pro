import request from '../utils/request';

export async function getListsNum(params){
  return request('/admin/clicks/total',{
    method:'POST',
    body:params,
  });
}

export async function getOnePageList(params){
  return request('/admin/clicks/page',{
    method:'POST',
    body:params,
  });
}

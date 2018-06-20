import request from '../utils/request';

export async function getListsNum(params){
  return request('/admin/records/total',{
    method:'POST',
    body:params,
  });
}

export async function getOnePageList(params){
  return request('/admin/records/page',{
    method:'POST',
    body:params,
  });
}

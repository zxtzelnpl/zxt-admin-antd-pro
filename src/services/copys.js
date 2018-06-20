import request from '../utils/request';

export async function getListsNum(params){
  return request('/admin/copys/total',{
    method:'POST',
    body:params,
  });
}

export async function getOnePageList(params){
  return request('/admin/copys/page',{
    method:'POST',
    body:params,
  });
}

import request from '../utils/request';

export async function getListsNum(params){
  return request('/admin/records/total',params);
}

export async function getOnePageList(params){
  return request('/admin/records/page',params);
}

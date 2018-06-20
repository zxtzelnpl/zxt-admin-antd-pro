import { getListsNum, getOnePageList } from '../services/records';

export default {
  namespace: 'copys',

  state: {
    data:{
      list:[],
      pagination:{},
    },
  },

  effects: {
    *total({ payload }, { call, put }) {
      const [total,page] = yield [call(getListsNum, payload),call(getOnePageList, {
        ...payload,
        pageSize: 10,
        current:1,
      })];

      yield put({
        type: 'saveTotal',
        payload: {
          list:page.list.map(item=>{
            return {
              ...item,
              key:item.record_id
            }
          }),
          pagination:{
            total:total.total,
            pageSize:page.pageSize,
            current:page.current,
          },
        },
      });
    },
    *page({ payload, callback }, { call, put }) {

      const response = yield call(getOnePageList, payload);
      yield put({
        type: 'savePage',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveTotal(state, action) {
      return {
        ...state,
        data:action.payload,
      }
    },
    savePage(state,action){
      const newState = {...state};
      newState.data.pagination.pageSize = action.payload.pageSize;
      newState.data.pagination.current = action.payload.current;

      const from = (action.payload.current-1)*action.payload.pageSize;

      action.payload.list.forEach((item,index)=>{
        newState.data.list[from+index] = item;
        newState.data.list[from+index].key =  action.payload.list[index].record_id;
      })

      return newState;
    },
  },
};

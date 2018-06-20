import { getListsNum, getOnePageList } from '../services/records';

export default {
  namespace: 'records',

  state: {
    data:{
      list:[],
      pagination:{},
    },
  },

  effects: {
    *total({ payload }, { call, put }) {
      const response = yield call(getListsNum, payload);

      yield put({
        type: 'saveTotal',
        payload: response,
      });
    },
    *page({ payload, callback }, { call, put }) {

      console.log(payload);

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
      const newState = {...state};
      newState.data.pagination.total = action.payload.total;
      return newState;
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

'use client'
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {StoreState, StoreActions} from './interface';

const initState: StoreState = {
    baseUrl:"",
};

const useStore = create<StoreState & StoreActions>()(
  devtools(
      immer((set) => ({
        ...initState,
        // 发送请求的域名
        setBaseUrl:(baseUrl:string)=>set(()=>({baseUrl})),
 
      })),
      {
        name: 'aid-global-store',
      },
  ),
);
export default useStore;

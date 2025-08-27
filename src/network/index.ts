//axios封装
import axios from 'axios';

export const img_url = 'https://www.xyvnai.com'
export const init_url = 'https://www.xyvnai.com/api'
// export const init_url = 'http://10.10.20.34:9304/api'
// export const img_url = 'http://10.10.20.34:9304'

const request = (option: any,pass=false,type='data') => {
  return new Promise(async (resolve, reject) => {
    const instance = axios.create({
        baseURL: init_url,
        timeout: 500000,
    });
    //请求拦截
    instance.interceptors.request.use(
      async (config: any) => {
        // const token = await getToken();
        // if (token){
        //     config.headers['cal-token'] = token;
        // }
        if (type==="formData") {
            config.headers["Content-Type"] = "application/json"
        }
        return config;
      },
      (err: any) => {
        console.log(err);
      },
    );
    //响应拦截
    instance.interceptors.response.use(
      (config: any) => {
        return config;
      },
      (err: any) => {
          // Toast.show({type:'error',text1:'Server Error',text2:"Please contact developer for assistance\n"+err.message})
        reject(err);
      },
    );
    instance(option)
      .then(async(res: any) => {
          // console.log('response',res)
        if (res && res.status === 200) {
        //     useStore.getState().setLoading(false)
        //     //当需要使用error, code, msg时，打开pass直接获取整个数据
            if (pass){
                resolve(res.data)
                return
            }
            if (res.data.code === 401) {
                reject(res.data.data);
            }
          if (res.data.code === 200) {
            // Toast.show({type:'success',text1:res.data.code+'',text2:res.data.msg})
            resolve(res.data.data);
          }
          else {
            reject(res.data);
            console.log('error code: ', res.data.code);
          }
        }
        else{

        }
      })
      .catch((err: any) => {
        reject(err);

      });
  }) as any;
};

export default request;
export const trimAndRemoveUndefined = (values: any) => {
    const _value:any = {};
    for (const valueKey in values) {
        if(typeof values[valueKey] !== "undefined"){
            if(typeof values[valueKey] === "string"){
                if(values[valueKey]){
                    _value[valueKey] = values[valueKey].trim();
                }
            }else{
                _value[valueKey] = values[valueKey]
            }
        }
    }
    return _value
}
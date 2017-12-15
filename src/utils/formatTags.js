/*
格式化颜色数据
*/
export function tagColor(tree){
  tree.forEach((item,index)=>{
    if(item.name=='颜色'){
      item.child.forEach((val,i)=>{
        let arr=val.name.split('|');
        val.name=arr[0];
        val.color=arr[1];
      })
    }
  })
  return tree
}


export function formatData(data){
  data.forEach((item,index)=>{
    if(item.tags){
      item.tags.forEach((val,i)=>{
        if(val.name.indexOf('|')>-1){
           let arr=val.name.split('|');
           val.name=arr[0];
           val.color=arr[1];
        }
      })
    }
  })
   return data
 }

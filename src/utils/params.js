export function collectParams(expect,form){
  let doneObj={};
  expect.forEach((item)=>{
    doneObj[item]=form[item]
  });
  return doneObj
}

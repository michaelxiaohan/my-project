import Cookies from 'js-cookie'
const Key = 'Auth-Key'
const Id='SessionId'

export function getAuthKey() {
  return Cookies.get(Key)
}

export function setAuthKey(authKey) {
  return Cookies.set(Key, authKey)
}

export function removeAuthKey() {
  return Cookies.remove(Key)
}
export function getSessionId() {
  return Cookies.get(Id)
}

export function setSessionId(sessionId) {
  return Cookies.set(Id, sessionId)
}

export function removeSessionId() {
  return Cookies.remove(Id)
}
export function setSessionStore(key,data){
  var menu=JSON.stringify(data)
  sessionStorage.setItem(key,menu)
}
export function getSessionStore(key){
 return JSON.parse(sessionStorage.getItem(key))
}

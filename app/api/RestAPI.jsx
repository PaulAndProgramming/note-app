const setRequestHeaders = (xhr, requestHeaders, method) => {
  //set content type to json since all any request body will be in json
  if (method != "GET") xhr.setRequestHeader('Content-Type', 'application/json');

  if (!requestHeaders) return;

  for (const headerKeyAndValue of requestHeaders) {
    let headerKey = headerKeyAndValue[0];
    let headerValue = headerKeyAndValue[1];
    xhr.setRequestHeader(headerKey, headerValue);
  }
};

const getResponseHeaders = (xhr, headersToReturn) => {
  if (!headersToReturn) return {};
  let headers = {};
  for (const header of headersToReturn) {
    headers[header] = xhr.getResponseHeader(header);
  }
  return headers;
};

//ajax request that returns a promise
const RESTCall = ({method, url, body, requestHeaders, headersToReturn}) => {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              const res = {
                body: this.responseText,
                headers: getResponseHeaders(xhr, headersToReturn)
              };
              resolve(res);
            } else {
              reject();
            }
         }
      };
      //reject on any error
      xhr.onerror = () => {reject()};
      xhr.open(method, url, true);
      setRequestHeaders(xhr, requestHeaders, method);
      xhr.send(body);
  });
}


//POST /users/login
export const post_users_login = (email, password) => RESTCall({
  method: "POST",
  url: "/users/login",
  body: JSON.stringify({email, password}),
  requestHeaders: undefined,
  headersToReturn: ['x-auth'],
});
//GET /users/me
export const get_users_me = (token) => RESTCall({
  method: "GET",
  url: "/users/me",
  body: undefined,
  requestHeaders: [
    ["x-auth", token]
  ],
  headersToReturn: undefined
});
//POST /notes
export const post_notes = (note_text, token) => RESTCall({
  method: "POST",
  url: "/notes",
  body: JSON.stringify({text: note_text}),
  requestHeaders: [
    ["x-auth", token]
  ],
  headersToReturn: undefined
});
//GET /notes
export const get_notes = (token) => RESTCall({
  method: "GET",
  url: "/notes",
  body: undefined,
  requestHeaders: [
    ["x-auth", token]
  ],
  headersToReturn: undefined
});
//DELETE /notes
export const delete_notes = (noteIds, token) => RESTCall({
  method: "DELETE",
  url: "/notes",
  body: JSON.stringify({noteIds: noteIds}),
  requestHeaders: [
    ["x-auth", token]
  ],
  headersToReturn: undefined
});
//DELETE /users/me/token
export const delete_users_me_token = (token) => RESTCall({
  method: "DELETE",
  url: "/users/me/token",
  body: undefined,
  requestHeaders: [
    ["x-auth", token]
  ],
  headersToReturn: undefined
});

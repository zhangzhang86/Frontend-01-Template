const list = document.getElementById("container").children
const result = []
for (let i of list) {
  if (i.getAttribute('data-tag').match(/css/)) {
    result.push({
      name: i.children[1].innerText,
      url: i.children[1].children[0].href
    })
  }
}
export default result;
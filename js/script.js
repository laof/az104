// function replaceAnswerDescriptionSpans() {
//   // 获取所有 class 为 answer-description 的 span 元素
//   const spans = document.querySelectorAll('span.answer-description');
//   spans.forEach(span => {
//     // 创建一个新的 div 元素
//     const div = document.createElement('div');
//     div.className = span.className;
//     div.innerHTML = span.innerHTML;
//     // 替换原有的 span
//     span.parentNode.replaceChild(div, span);
//   });
// }

// replaceAnswerDescriptionSpans();

document
  .querySelectorAll(".multi-choice-item:not(.correct-hidden)")
  .forEach((item) => item.remove());

function findDeepestDescendant(element) {
  // 如果没有子元素，返回自身
  if (!element.children || element.children.length === 0) {
    return element;
  }
  // 递归查找第一个子元素的最深后代
  return findDeepestDescendant(element.children[0]);
}

document.querySelectorAll(".item[data-index]").forEach((ele) => {
  let f = false;
  ele.querySelectorAll(".answer-description>*").forEach((item) => {
    if (f) return item.remove();

    const deepest = findDeepestDescendant(item);
    console.log(deepest.innerText);
    if (deepest.innerText === "-----------------") {
      f = true;
      item.remove();
    }
  });
});

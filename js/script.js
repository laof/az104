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
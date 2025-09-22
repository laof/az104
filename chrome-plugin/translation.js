Array.from(document.querySelectorAll(".question-discussion-header")).forEach(
  (header) => header.remove()
);
function add() {
  fetch("http://localhost:3000/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: location.pathname.replace("/", ""),
      text: document.querySelector("html").outerHTML,
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      console.info(res.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function smoothScrollToBottom() {
  const interval = setInterval(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      clearInterval(interval);
      add();
      console.log("Reached the bottom of the page.");
      return;
    }
    window.scrollBy(0, 100);
  }, 100);
}

// 调用方法
smoothScrollToBottom();
